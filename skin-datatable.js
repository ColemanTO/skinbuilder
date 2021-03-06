YUI.add('skin-datatable', function (Y) {

Y.Skin.renderers.datatable = function (skin) {
    var space = skin.colorspace;

    return {
        captionPadding: skin.padding(1, 0),
        cellPadding: skin.padding(0.3, 0.6),   // 4px 10px 4px 10px;

        headGradient:   space.block.normal.gradient,
        headBackground: space.block.normal.background,
        headText:       space.block.normal.text.normal,
        headBorder:     space.border.low,
        cellBackground: space.background,
        cellText:       space.text.normal,
        cellOddBackground: space.border.low,
        cellOddText:   space.hover.text.normal,

        headSortedBackground:   space.block.high.background,
        headSortedGradient:     space.block.high.gradient,
        headSortedText:         space.block.high.text.normal,
        headSortedHoverBackground:   space.block.high.background,
        headSortedHoverText:         space.block.high.text.normal,

        cellSortedEvenBackground:   space.block.low.background,
        cellSortedOddBackground:   space.block.low.border.low,
        cellSortedEvenText:         space.block.low.hover.text.normal,

        border:        space.border.low,
        captionText:    space.block.container.text.low
    };
};

}, '0.0.1', {
    requires: ['skin-space']
});
