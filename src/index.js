import { registerBlockType } from '@wordpress/blocks';
import { 
    useBlockProps, 
    InspectorControls, 
    MediaUpload, 
    MediaUploadCheck, 
    RichText // 引入 RichText 组件
} from '@wordpress/block-editor';
import { TextControl, PanelBody, RangeControl, URLInput, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// 导入 block.json，包含区块的元数据和属性
import metadata from './block.json';

// 用于计算星级评分的宽度 (假设满分 10 分)
const getStarWidth = (score) => {
    // 满分 10 分，评分 6 分对应 60% 宽度，评分 4 分对应 40% 宽度
    return `${score * 10}%`; 
};

/**
 * 编辑器视图
 */
const Edit = ({ attributes, setAttributes }) => {
    const { imageUrl, titleText, ratingScore, abstractText, titleLink } = attributes;
    const blockProps = useBlockProps();

    const onSelectImage = (media) => {
        setAttributes({ imageUrl: media.url });
    };

    // 处理评分输入，并确保它是一个数字
    const handleRatingChange = (newScore) => {
        // 允许用户输入空字符串，但保存时会转为 0
        setAttributes({ ratingScore: newScore === '' ? 0 : parseFloat(newScore) });
    };

    return (
        <div {...blockProps}>
            {/* 块设置侧栏 (InspectorControls) */}
            <InspectorControls>
                <PanelBody title={__('卡片内容设置 (侧栏)', 'content-card')}>
                    
                    {/* 评分控制 (在此处编辑评分) */}
                    <RangeControl
                        label={__('评分 (0-10)', 'content-card')}
                        value={ratingScore}
                        onChange={(newRatingScore) => setAttributes({ ratingScore: newRatingScore })}
                        min={0}
                        max={10}
                        step={0.1}
                    />

                    {/* 标题链接控制 */}
                    <URLInput
                        label={__('标题链接', 'content-card')}
                        value={titleLink}
                        onChange={(newTitleLink) => setAttributes({ titleLink: newTitleLink })}
                    />
                    
                    {/* 图片 URL 文本输入 */}
                    <TextControl
                        label={__('外部图片 URL', 'content-card')}
                        value={imageUrl}
                        onChange={(newImageUrl) => setAttributes({ imageUrl: newImageUrl })}
                        help={__('可以直接输入外部图片链接，或使用下方媒体库按钮。', 'content-card')}
                    />
                
                    {/* 描述/摘要已移至主编辑区直接编辑 */}
                </PanelBody>
            </InspectorControls>

            {/* 编辑器内卡片预览 */}
            <div className="doulist-item">
                <div className="doulist-subject">
                    <div className="doulist-post">
                        {/* 媒体上传组件 */}
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={imageUrl}
                                render={({ open }) => (
                                    <div 
                                        className="content-card-image-wrapper" 
                                        style={{ width: '96px', height: '96px', position: 'relative' }}
                                    >
                                        {imageUrl ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={titleText || '内容卡片图片'} 
                                            />
                                        ) : (
                                            <div 
                                                onClick={open} 
                                                style={{ width: '96px', height: '96px', backgroundColor: '#ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
                                            >
                                                {__('添加图片', 'content-card')}
                                            </div>
                                        )}
                                        {imageUrl && (
                                            <Button 
                                                isDestructive
                                                onClick={() => setAttributes({ imageUrl: '' })}
                                                style={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}
                                            >
                                                X
                                            </Button>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>
                    <div className="doulist-content">
                        {/* 标题输入框 (可直接编辑) */}
                        <TextControl
                            value={titleText}
                            onChange={(newTitleText) => setAttributes({ titleText: newTitleText })}
                            placeholder={__('在此处输入标题', 'content-card')}
                            className="doulist-title-input"
                            label={__('标题', 'content-card')}
                        />
                        <div className="rating">
                            <span className="allstardark">
                                <span className="allstarlight" style={{ width: getStarWidth(ratingScore) }}></span>
                            </span>
                            {/* 评分输入 - 使用 TextControl 实现直接输入 */}
                            <TextControl
                                value={ratingScore}
                                onChange={handleRatingChange}
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                placeholder="4.0"
                                className="rating-input"
                                style={{ width: '50px', marginLeft: '5px', display: 'inline-block' }}
                            />
                        </div>
                        {/* 描述/摘要 (现在使用 RichText，可直接点击编辑) */}
                        <RichText
                            tagName="div" // 使用 div 标签以匹配您的 CSS 结构
                            className="abstract"
                            value={abstractText}
                            onChange={(newAbstractText) => setAttributes({ abstractText: newAbstractText })}
                            placeholder={__('在此处输入描述/摘要', 'content-card')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * 保存视图 (前端展示)
 */
const Save = ({ attributes }) => {
    const { imageUrl, titleText, ratingScore, abstractText, titleLink } = attributes;
    const blockProps = useBlockProps.save();

    const starWidth = getStarWidth(ratingScore);

    if (!imageUrl) {
        return null; 
    }

    return (
        <figure {...blockProps} className="wp-block-embed is-type-rich">
            <div className="wp-block-embed__wrapper">
                <div className="doulist-item">
                    <div className="doulist-subject">
                        <div className="doulist-post">
                            <img 
                                decoding="async" 
                                referrerpolicy="no-referrer"
                                src={imageUrl}
                                alt={titleText || '内容卡片图片'}
                            />
                        </div>
                        <div className="doulist-content">
                            <div className="doulist-title">
                                <a 
                                    href={titleLink} 
                                    className="cute"
                                    target="_blank" 
                                    rel="external nofollow"
                                > 
                                    {/* ✒️符号保留在用户输入或自动生成中 */}
                                    {`${titleText} `} 
                                </a>
                            </div>
                            <div className="rating">
                                <span className="allstardark">
                                    <span 
                                        className="allstarlight"
                                        style={{ width: starWidth }}
                                    ></span>
                                </span>
                                <span className="rating_nums">{`${ratingScore} `}</span>
                            </div>
                            {/* 使用 RichText.Content 渲染描述内容 */}
                            <RichText.Content
                                tagName="div"
                                className="abstract" 
                                value={`${abstractText} `}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </figure>
    );
};

// 注册区块
registerBlockType(metadata.name, {
    edit: Edit,
    save: Save,
});