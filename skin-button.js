
var buttonSkin,
    refreshButtonSkin = function() {

    buttonSkin = {
        skinName: space.skin.name,
        prefix:   space.skin.prefix,

        buttonRadius: getRadius(0.4),
        padding: getPadding(0.4, 1, 0.45),
        background: space.block.high.background,
        gradient:   space.block.high.gradient,
        text:       space.block.high.text.normal,
        borderHigh: space.block.high.border.high,
        borderLow:  space.block.high.border.low,



        hoverBackground:    space.block.high.hover.background,
        hoverText:          space.block.high.hover.text.normal,
        hoverBorderHigh:    space.block.high.hover.border.high,
        hoverBorderLow:     space.block.high.hover.border.low,


        selectedBackground: space.block.highest.background,
        selectedGradient:   space.block.highest.gradient,
        selectedText:       space.block.highest.text.normal,
        selectedBorderHigh: space.block.highest.border.high,
        selectedBorderLow:  space.block.highest.border.low,



        selectedHoverBackground:    space.block.highest.hover.background,
        selectedHoverText:          space.block.highest.hover.text.normal,
        selectedHoverBorderHigh:    space.block.highest.hover.border.high,
        selectedHoverBorderLow:     space.block.highest.hover.border.low,


        foo: space


    };

};