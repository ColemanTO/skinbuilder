// TODO:
// - Remove Color Palette CSS from textarea output.
// - Break out sample widgets into separate module.
// - Convert input handling and Picker to OO-style.
// - Y.Appify?

YUI({
    filter: 'raw',
    modules: {
        'skin'       : 'skin.js',
        'colorspace'       : 'colorspace.js',
        'colorspace-schemes'       : 'colorspace-schemes.js',
        'skin-autocomplete': 'skin-autocomplete.js',
        'skin-button'      : 'skin-button.js',
        'skin-calendar'    : 'skin-calendar.js',
        'skin-datatable'   : 'skin-datatable.js',
        'skin-dial'        : 'skin-dial.js',
        'skin-table'        : 'skin-table.js',
        'skin-node-menunav': 'skin-node-menunav.js',
        'skin-overlay'     : 'skin-overlay.js',
        'skin-panel'       : 'skin-panel.js',
        'skin-scrollview'  : 'skin-scrollview.js',
        'skin-slider'      : 'skin-slider.js',
        'skin-space'      : 'skin-space.js',
        'skin-tabview'     : 'skin-tabview.js',

        'skinner': {
            use: [
                'skin', 'colorspace-schemes', 'skin-autocomplete', 'skin-button',
                'skin-calendar', 'skin-datatable', 'skin-dial',
                'skin-node-menunav', 'skin-overlay', 'skin-panel',
                'skin-scrollview', 'skin-slider', 'skin-tabview', 'skin-table'
            ]
        }
    }
}).use(
    'skinner', 'handlebars',
    'slider', 'overlay', 'panel', 'node-menunav', 'dial', 'autocomplete',
    'autocomplete-filters', 'autocomplete-highlighters', 'scrollview',
    'datatable-sort', 'dd-drag', 'dd-constrain', 'calendar', 'button-plugin',
    'tabview', 'datatype-date', 'button-group', 'cssbutton',
    'node-event-delegate', 'overlay', 'color',
function (Y) {

    var PAGE_BG_COLOR = '#fff',
        KEY_COLOR = { 
            page: PAGE_BG_COLOR,
            background: '#ffffff',
            block: {
                low: {},  
                normal: {},  
                high: {
                    background: ''
                },  
                highest: {
                    background: '#3355BA'
                }   
            }   
        },

        SCHEME_NAME = 'monochrome', // default schemeName
        SCHEME_NAMES = Y.Object.keys(Y.ColorSpace.schemes),

        SCHEME_CUSTOM = {  
            high: {h:0, s:-30, l:60},
            normal: {h:0, s:-30, l:75},
            low: {h:0, s:-30,  l:80},
            background: {h:0, s:-30,  l:90}
        },


        STYLESHEET = document.documentElement.appendChild(document.createElement('style')),

        SKIN = new Y.Skin({
            name: 'mine',
            scheme: SCHEME_NAME,
            keycolor: KEY_COLOR.block.highest.background,
            container: PAGE_BG_COLOR
        }),

        TEMPLATES = {};

    function hexToHsl(hexInput) {
        var hslStr = Y.Color.toHSL(hexInput),
            hslArr = Y.Color.toArray(hslStr);

        return hslArr;
    }

    
    /** Updates the swatches in the UI display of scheme choices
    renders a colorspace for each scheme
    this takes time. Only do this when the Scheme tabview is shown.
    @param {Boolean} custom   true = only render new scheme 'custom' and only update it's preview swatches 
                              false or undefined = render all schemes and update all preview swatches
    **/
    function updateSchemePreviews() {
        var i,
            space,
            schemeChoices = Y.all('.scheme-radios .pick');

        for (i = 0; i < SCHEME_NAMES.length; i+=1) {
            space = new Y.ColorSpace({
                scheme: SCHEME_NAMES[i]
            }).render(KEY_COLOR.block.highest.background);
            schemeChoices.item(i).one('.swatches li:nth-child(1)').setStyle('backgroundColor', space.block.highest.background);
            schemeChoices.item(i).one('.swatches li:nth-child(2)').setStyle('backgroundColor', space.block.high.background);
            schemeChoices.item(i).one('.swatches li:nth-child(3)').setStyle('backgroundColor', space.block.normal.background);
            schemeChoices.item(i).one('.swatches li:nth-child(4)').setStyle('backgroundColor', space.block.low.background);
        }
        // custom scheme isn't in the SCHEME_NAMES [], so need to do separately
        // No need to create a new Y.ColorSpace, since Custom should always 
        // track the current scheme (even when custom scheme is the current)
        schemeChoices.item(i).one('.swatches li:nth-child(1)').setStyle('backgroundColor', SKIN.colorspace.block.highest.background);
        schemeChoices.item(i).one('.swatches li:nth-child(2)').setStyle('backgroundColor', SKIN.colorspace.block.high.background);
        schemeChoices.item(i).one('.swatches li:nth-child(3)').setStyle('backgroundColor', SKIN.colorspace.block.normal.background);
        schemeChoices.item(i).one('.swatches li:nth-child(4)').setStyle('backgroundColor', SKIN.colorspace.block.low.background);
    }

    function updateCSS() {
        var cssOutput = document.getElementById('textarea-style'),
            css = '',
            cssSpace = '';

        Y.Object.each(TEMPLATES, function(template, name) {
            if(name === 'space') {
                cssSpace += SKIN.render(name, template);
            } else {
                css += SKIN.render(name, template);                
            }
        });

        cssOutput.value = css;
        STYLESHEET.innerHTML = cssSpace + css;
    }

    // this runs the code for the correct scheme
    // sets the page background color
    // updates the widgetSkinMaps
    // substitutes the new colors into the CSS
    function updateColors() {
        SKIN.options.container = PAGE_BG_COLOR;
        if (SCHEME_NAME === 'custom') {
            SKIN.options.scheme = SCHEME_CUSTOM;
        } else {
            SKIN.options.scheme = SCHEME_NAME;           
        }
        updateCSS();
        Y.one('.page-background').setStyle('backgroundColor', PAGE_BG_COLOR);
    }

    // Populate TEMPLATES from HTML document.
    Y.Object.each(Y.Skin.renderers, function(fn, name) {
        TEMPLATES[name] = document.getElementById(name + '-template').innerHTML;
    });

    updateColors();

    // END  color schemes and foreground color gen ////////////////////////////////////////////////


    /**
     * Begin adding instances of widgets to be colored by this tool
     * These are for UI display
     */
    // Create a new instance of Calendar,    ////////////////////////////////////////////
    //setting its width
    // and height, allowing the dates from the previous
    // and next month to be visible and setting the initial
    // date to be November, 1982.
    var calendar = new Y.Calendar({
          contentBox: "#mycalendar",
//          height:'200px',
//          width:'600px',
          showPrevMonth: true,
          showNextMonth: true,
          date: new Date(1982,11,1)}).render();
    // make a day selected for display
    var days = Y.all('.yui3-calendar-day');
    days.item(12).addClass('yui3-calendar-day-selected');
    days.item(13).addClass('yui3-calendar-selection-disabled');

    // Instance of tabview  /////////////////////////////////////////////////////////////
    var tabview = new Y.TabView({
        srcNode: '#tabview',
        width: '250px'
    });

    tabview.render();

    // Disabled button //////////////////////////////////////////////
    // A disabled button
    var disabledButton = Y.one('#myDisabledButton');
    disabledButton.plug(Y.Plugin.Button, {
        disabled: true
    });


    // Datatable instance ///////////////////////////////////////////////////////
    var cols = [
        {key:"Company", label:"Sortable", sortable:true},
        {key:"Phone", label:"Not Sortable"},
        {key:"Contact", label:"Sortable", sortable:true}
    ],
    data = [
        {Company:"Cabs", Phone:"415-555-1234", Contact:"Smith, S."},
        {Company:"Acme", Phone:"650-555-4444", Contact:"Jones, J."},
        {Company:"Washers", Phone:"408-555-5678", Contact:"Ward, R."}
    ],
    table = new Y.DataTable({
        columns: cols,
        data   : data,
        summary: "Contacts list",
        caption: "Table with simple column sorting"
    }).render("#datatable");

    // Scrollview instance Horizontal ///////////////////////////////////////////////////
    var scrollViewX = new Y.ScrollView({
        id: "scrollview",
        srcNode: '#scrollview-content-horiz',
        //height: 100, // specifying the height is only allowed on a vertical scrollView
        width: 300,
        flick: {
            minDistance:2,
            minVelocity:0.1,
            axis: "x"
        }
    });
    scrollViewX.render();

    // Scrollview instance Vertical ///////////////////////////////////////////////////
    var scrollView = new Y.ScrollView({
        id: "scrollview",
        srcNode: '#scrollview-content',
        height: 128,
        //width: 300,  specifying the width is only allowed on a horizontal scrollView
        flick: {
            minDistance:5,
            minVelocity:0.3,
            axis: "y"
        }
    });
    scrollView.render();


    // Autocomplete instance ////////////////////////////////////////////////////
    var states = [     'Alabama',     'Alaska',     'Arizona',     'Arkansas',     'California',     'Colorado',     'Connecticut',     'Delaware',     'Florida',     'Georgia',     'Hawaii',     'Idaho',     'Illinois',     'Indiana',     'Iowa',     'Kansas',     'Kentucky',     'Louisiana',     'Maine',     'Maryland',     'Massachusetts',     'Michigan',     'Minnesota',     'Mississippi',     'Missouri',     'Montana',     'Nebraska',     'Nevada',     'New Hampshire',     'New Jersey',     'New Mexico',     'New York',     'North Dakota',     'North Carolina',     'Ohio',     'Oklahoma',     'Oregon',     'Pennsylvania',     'Rhode Island',     'South Carolina',     'South Dakota',     'Tennessee',     'Texas',     'Utah',     'Vermont',     'Virginia',     'Washington',     'West Virginia',     'Wisconsin',     'Wyoming'   ];
    Y.one('#ac-input').plug(Y.Plugin.AutoComplete, {
        resultFilters    : 'phraseMatch',
        resultHighlighter: 'phraseMatch',
        source           : states
    });

    // Dial instance ////////////////////////////////////////////////////////////
    var dial = new Y.Dial({
        min:-220,
        max:220,
        stepsPerRevolution:100,
        value: 30
    });
    dial.render('#dial');

    // Node Menunav instance /////////////////////////////////////////////////
    var menu = Y.one("#node-menunav");
    menu.plug(Y.Plugin.NodeMenuNav);

    var menuSplit = Y.one("#node-menunav-split");
    //menuSplit.plug(Y.Plugin.NodeMenuNav);
    menuSplit.plug(Y.Plugin.NodeMenuNav, { autoSubmenuDisplay: false, mouseOutHideDelay: 0 });

    // Overlay instance /////////////////////////////////////////////////////
    var overlay = new Y.Overlay({
        // Specify a reference to a node which already exists
        // on the page and contains header/body/footer content
        srcNode:"#overlayContent",

        // Also set some of the attributes inherited from
        // the base Widget class.
        visible:true,
        headerContent:"My Overlay Header",
        bodyContent:"My Overlay Body",
        footerContent:"My Footer Content",
        //xy:[300, 300],
        width: 200
    });
    overlay.render();
    var anchorOverlay = Y.one('#anchorOverlay');

    // Panel instance ////////////////////////////////////////////////////////
    var panel = new Y.Panel({
        srcNode      : '#panelContent',
        headerContent: 'Add A New Product',
        width        : 250,
        zIndex       : 5,
        centered     : false,
        modal        : false,
        visible      : true,
        render       : true,
        plugins      : [Y.Plugin.Drag]
    });
    panel.addButton({
        value  : 'Add Item',
        section: Y.WidgetStdMod.FOOTER,
        action : function (e) {
            e.preventDefault();
            addItem();
        }
    });
    // var overlayNode = Y.one('#overlayContent');
    var anchorPanel = Y.one('#anchorPanel');

    // Slider instance ///////////////////////////////////////////////////////////
    var report = Y.one('#slider-report'),
        slider = new Y.Slider({
            //axis  : 'y',
            length: '280px',
            min   : 10,
            max   : 218,
            value : 136,
        //    minorStep: 3,
            after : {
                valueChange: function (e) {
                    report.setHTML(e.newVal);
                }
            }
        });
    slider.render('#slider');

    // End of adding instances of widgets to be colored by this tool
    /////////////////////////////////////////////////////////////////

    // tabview for holding controls in left grid column //////////////////////////////////
    var tabviewControls = new Y.TabView({
        srcNode: '#tabview-controls',
        //width: '285px'
    });

    tabviewControls.render();

    // slider for radius changing in the UI ///////////////////////////////////

    var radiusDefaultValue = 10,
        sliderRadius = new Y.Slider({
        axis  : 'x',
        length: '200px',
        min   : 0,
        max   : 40,
        value : radiusDefaultValue,
    //    minorStep: 3,
        after : {
            valueChange: function (e) {
                //report.setHTML(e.newVal);
                var newVal = e.target.get('value');
                SKIN.options.radius = e.newVal;
                updateColors();
                Y.one('.slider-markup-border-radius label').setHTML('Border-radius: ' + (newVal * 10) + '%');
            }
        }
    });

    sliderRadius.render('#slider-radius');
    Y.one('.reset-radius').on('click', function() {
        sliderRadius.set('value', radiusDefaultValue);
    });
    // end slider for radius ///////////////////////////




    // slider for text contrast changing in the UI ///////////////////////////////////

    var sliderTextContrast = new Y.Slider({
        axis  : 'x',
        length: '175px',
        min   : 5,
        max   : 30,
        value : SKIN._space.options.textContrast * 10,
        minorStep: 1,
        after : {
            valueChange: function (e) {
                //report.setHTML(e.newVal);
                var newVal = e.target.get('value');
                SKIN._space.options.textContrast = e.newVal / 10; // works
                Y.one('.slider-markup-text-contrast label').setHTML('Text contrast: ' + newVal * 10);
                // Matt?
                // SKIN.options.textContrast = e.target.get('value') / 10; // doesn't work
                SKIN.initColorSpace();
                updateColors();
            }
        }
    });

    sliderTextContrast.render('#slider-text-contrast');
    Y.one('.reset-text-contrast').on('click', function() {
        sliderTextContrast.set('value', SKIN.options.defaultTextContrast * 10);
    });
    // end slider for text contrast ///////////////////////////




    // slider for changing Horizontal padding in the UI ///////////////////////////////////
    var paddingHorizDefaultValue = 50;
    var sliderPaddingHoriz = new Y.Slider({
        axis  : 'x',
        length: '200px',
        min   : 0,
        max   : 200,
        value : paddingHorizDefaultValue,
//        minorStep: 0.1,
        after : {
            valueChange: function (e) {
                //Y.log(e.newVal / 50);
                //report.setHTML(e.newVal);
                var newVal = e.target.get('value');
                SKIN.options.paddingHoriz = e.newVal / 50;
                updateColors();
                overlay.move([anchorOverlay.getX(),  anchorOverlay.getY()]);
                panel.move([anchorPanel.getX(),  anchorPanel.getY()]);
                Y.one('.slider-markup-horiz-padding label').setHTML('Horiz. padding: ' + (newVal * 2) + '%');

            }
        }
    });

    sliderPaddingHoriz.render('#slider-padding-horiz');
    var sliderPaddingHorizThumb = Y.one('#slider-padding-horiz .yui3-slider-thumb');
    Y.one('.reset-padding-horiz').on('click', function() {
        sliderPaddingHoriz.set('value', paddingHorizDefaultValue);
    });
    // end slider for Horizontal padding///////////////////////////

    // slider for changing Vertical padding in the UI ///////////////////////////////////
    var paddingVertDefaultValue = 50,
        sliderPaddingVert = new Y.Slider({
        axis  : 'y',
        length: '65px',
        min   : 200,
        max   : 0,
        value : paddingVertDefaultValue,
//        minorStep: 0.1,
        after : {
            valueChange: function (e) {
                //Y.log(e.newVal / 50);
                //report.setHTML(e.newVal);
                var newVal = e.target.get('value');
                SKIN.options.paddingVert = (e.newVal / 50);
                updateColors();
                overlay.move([anchorOverlay.getX(),  anchorOverlay.getY()]);
                panel.move([anchorPanel.getX(),  anchorPanel.getY()]);
                Y.one('.slider-markup-vert-padding label').setHTML('Vert. padding: ' + (newVal * 2) + '%');                
            }
        }
    });

    sliderPaddingVert.render('#slider-padding-vert');
    var sliderPaddingVertThumb = Y.one('#slider-padding-vert .yui3-slider-thumb');
    Y.one('.reset-padding-vert').on('click', function() {
        sliderPaddingVert.set('value', paddingVertDefaultValue);
    });
    // end slider for Vertical padding ///////////////////////////


    //////////////////////////////////////////////////////////////////////////
    // Color scheme changer //////////////////////////////////////////////////

    /* this checks background-color of page (in space) and checks to see if
     * it's appropriate for the choosen color scheme, if not it changes to
     * either white or black
     */
    var handleSchemeChangePageColor = function(schemeName) {
        //
        //alert('PAGE_BG_COLOR: ' + PAGE_BG_COLOR);
        var hsl = hexToHsl(PAGE_BG_COLOR);
        if (schemeName.indexOf('dark') > -1) {
            if (hsl[2] > 50) {
                // dark scheme, but light page color
                PAGE_BG_COLOR = '#000000';
            }
        } else if (hsl[2] <= 50){
                // not a dark scheme, but dark page color
                PAGE_BG_COLOR = '#ffffff';
        }
    };

    // listener for scheme changing radios
    Y.one('.scheme-radios').delegate('click', function(){

        //    SKIN._space._adjust.high
        //  Y.ColorSpace.schemes.custom

        var radios = Y.all('.scheme-radios input');
        SCHEME_NAME = this.get('id');
        if (SCHEME_NAME === 'custom') {
            Y.all('.bucket-scheme').removeClass('bucket-scheme-hidden');
        } else {
            Y.all('.bucket-scheme').addClass('bucket-scheme-hidden');
        }
        handleSchemeChangePageColor(SCHEME_NAME); // change page background-color if needed
        updateColors();

//        if (SCHEME_NAME !== 'custom') {
            // set values of custom scheme from selected scheme _adjust
            SCHEME_CUSTOM.background.h = SKIN._space._adjustBG.h;
            SCHEME_CUSTOM.background.s = SKIN._space._adjustBG.s;
            SCHEME_CUSTOM.background.l = SKIN._space._adjustBG.l;

            SCHEME_CUSTOM.high.h = SKIN._space._adjust.high.h;
            SCHEME_CUSTOM.high.s = SKIN._space._adjust.high.s;
            SCHEME_CUSTOM.high.l = SKIN._space._adjust.high.l;

            SCHEME_CUSTOM.normal.h = SKIN._space._adjust.normal.h;
            SCHEME_CUSTOM.normal.s = SKIN._space._adjust.normal.s;
            SCHEME_CUSTOM.normal.l = SKIN._space._adjust.normal.l;

            SCHEME_CUSTOM.low.h = SKIN._space._adjust.low.h;
            SCHEME_CUSTOM.low.s = SKIN._space._adjust.low.s;
            SCHEME_CUSTOM.low.l = SKIN._space._adjust.low.l;

            updateSchemePreviews(); // updates only 'custom' scheme preview swatches to match selected scheme
//        }

        radios.set('checked', false);
        this.set('checked', true);
    }, 'input');



    ///////////////////////////  Color Picker instance and handlers  /////////////////////////////////
    var xy = [40, 40];
    var overlayPicker = new Y.Overlay({
        srcNode:"#picker-outer",
        // width:"13em",
        // height:"10em",
        xy: [-800, 200]
    });
    overlayPicker.render();

    var ddPicker = new Y.DD.Drag({
        node: '#picker-outer'
    });

    var hsDot = new Y.DD.Drag({
        node: '#hs-dot'
    }).plug(Y.Plugin.DDConstrained, {
        constrain2node: '#hs'
    });

    var lightHandle = new Y.DD.Drag({
        node: '#sliderL-line'
    }).plug(Y.Plugin.DDConstrained, {
        constrain2node: '#sliderL'
    });

        // set the picker outer box ready for drag by grip
        var pickerOuter = Y.one('#picker-outer');
        pickerOuter.plug(Y.Plugin.Drag);

        //Now you can only drag it from the .grip at the top of the blue box
        pickerOuter.dd.addHandle('#picker-outer .grip');


    var pickerH = 0,
        pickerS = 50,
        pickerL = 50,
        objBucket = Y.one('.bucket-highest');

        /* this updates the color swatch in the picker
        * and the hex input control when contol*/
    var pickerUpdateColors = function(objBucket){
            var hsl = Y.Color.fromArray([pickerH, pickerS, pickerL], Y.Color.TYPES.HSL),
            hex = Y.Color.toHex(hsl);

            // depending on which bucket was clicked
            // change either the key color or the page background color
            if (objBucket.hasClass('page-background')) {
                PAGE_BG_COLOR = hex;
                SKIN.options.container = hex;
            } else if (objBucket.hasClass('bucket-highest')) {
                KEY_COLOR.block.highest.background = hex;
                SKIN.options.keycolor = hex;
            }

            // Using async to keep UI snappy.
            Y.config.win.setTimeout(updateColors, 20);

            Y.one('.picker-swatch').setStyles({'backgroundColor': hex});
            Y.one('.picker-swatch .picker-input').set('value', hex);
        };

    var handlePickerTextInput = function(e) {
        var hex = Y.one('.picker-input').get('value');
        if (objBucket.hasClass('page-background')) {
            PAGE_BG_COLOR = hex;
        } else if (objBucket.hasClass('bucket-highest')) {
            KEY_COLOR.block.highest.background = hex;
        }
        updateColors();

        Y.one('.picker-swatch').setStyles({'backgroundColor': hex});
        //Y.one('.picker-swatch .picker-input').set('value', hex);
    };
    Y.one('.picker-swatch .picker-input').on('blur', handlePickerTextInput);


    var handlePicker = function(e) {
        var relX = (e.clientX - e.currentTarget.getX() + Y.one('document').get('scrollLeft')),
            relY = (e.clientY - e.currentTarget.getY() + Y.one('document').get('scrollTop'));

        pickerH = relX * 2; // hue sat image in picker is 180 px wide. 2 * 180 = range of 0 to 360 for hue
        pickerS = 100 -( relY / 180) * 100; // sat range is 0 to 100
        Y.one('#hs-dot').setStyles({'top': relY + 'px', 'left': relX + 'px'});

        pickerUpdateColors(objBucket);
    };
    var handleLight = function(e) {
        pickerL = 100 - ((e.clientY - e.currentTarget.getY() + Y.one('document').get('scrollTop')) / 180) * 100; // lightness range is 0 to 100
        Y.one('#sliderL-line').setStyle('top', (e.clientY - e.currentTarget.getY() + Y.one('document').get('scrollTop')) + 'px');
        pickerUpdateColors(objBucket);
    };
    var showPicker = function(e) {
        var relX = (e.clientX + Y.one('document').get('scrollLeft')),
            relY = (e.clientY + Y.one('document').get('scrollTop')),
            bucketHex,
            hsl;

        overlaySchemer.hide(); 
        if (Y.one('.bucket-selected')) {
            Y.one('.bucket-selected').removeClass('bucket-selected');
        }
        e.target.addClass('bucket-selected');

        // For case of multiple buckets to click on
        // we need to update the color picker display
        // on picker show
        // also set the var objBucket, which is the DOM obj to receive the new color
        if (e.currentTarget.hasClass('bucket-page')) {
            objBucket = Y.one('.page-background');
            bucketHex = PAGE_BG_COLOR;
        } else if (e.currentTarget.hasClass('bucket-highest')){
            objBucket = e.currentTarget;
            bucketHex = KEY_COLOR.block.highest.background;
        }
        Y.one('.picker-swatch .picker-input').set('value', bucketHex);

        // set UI to match color of bucket value clicked on
        hsl = Y.Color.toArray(Y.Color.toHSL(bucketHex));
        Y.one('#hs-dot').setStyles({'left': hsl[0] / 2, 'top': (hsl[1] / 100) * 180});
        Y.one('#sliderL-line').setStyle('top', 180 - ((hsl[2] / 100) * 180));
        Y.one('.picker-swatch').setStyle('backgroundColor', bucketHex);
        // set all of the values that are used in pickerUpdateColors()
        // so it will be ready to take a click, either h&s  or l
        pickerH = hsl[0];
        pickerS = hsl[1];
        pickerL = hsl[2];

        overlayPicker.show();
        overlayPicker.move([(relX + 40), (relY + 10)]);

    };
    var handlePickerInputBlur = function(e) {
        var hsl = hexToHsl(Y.Escape.html(e.currentTarget.get('value')));

        pickerH = hsl[0];
        pickerS = hsl[1];
        pickerL = hsl[2];
        pickerUpdateColors(objBucket);

    };

    ////////////////////  scheme creator overlay  /////////////////////////////
    var schemeOverlayIsReady = false,
        blockAdjust = {h: '', s: '', l: ''}, // the adjust object of the correct block in the SKIN._space
        schemeBlockDOM; // the DOM object of the correct block. Used for updating the swatch on the scheme adjust overlay


    // update the output textarea content
    var updateTextAreaSettings = function(){
        var schemeOutputStr = '',
            textContrast = '\nText contrast: ' + SKIN._space.options.textContrast * 100 + '%',
            borderRadius = '\nBorder radius: ' + SKIN.options.radius * 10 + '%',
            paddingHoriz = '\nHoriz. padding: ' + SKIN.options.paddingHoriz * 100 + '%',
            paddingVert = '\nVert. padding: ' + SKIN.options.paddingVert * 100 + '%';

        schemeOutputStr = '// Color scheme settings'+
        '\nY.colorspace.schemes.' + SCHEME_NAME + ' = {\n' +
                                
        '    high:       {h: ' + SCHEME_CUSTOM.high.h + ', s: ' + SCHEME_CUSTOM.high.s + ', l: ' + SCHEME_CUSTOM.high.l + '},\n'+
        '    normal:     {h: ' + SCHEME_CUSTOM.normal.h + ', s: ' + SCHEME_CUSTOM.normal.s + ', l: ' + SCHEME_CUSTOM.normal.l + '},\n'+
        '    low:        {h: ' + SCHEME_CUSTOM.low.h + ', s: ' + SCHEME_CUSTOM.low.s + ', l: ' + SCHEME_CUSTOM.low.l + '},\n'+ 
        '    background: {h: ' + SCHEME_CUSTOM.background.h + ', s: ' + SCHEME_CUSTOM.background.s + ', l: ' + SCHEME_CUSTOM.background.l + '}\n'+ 
//            '    page:       {h: ' + adjustBlocks[3].h + ', s: ' + adjustBlocks[3].s + ', l: ' + adjustBlocks[3].l + '},\n'+ 
        '};';

        Y.one('#textarea-scheme').setHTML(schemeOutputStr + '\n// Other skin settings' + textContrast + borderRadius + paddingHoriz + paddingVert);
    }

    // set the scheme color swatch in the schemeOverlay
    // Update the scheme with the new scheme color adjustment object values
    var handleSchemeValueChange = function() {
/*            adjustBlocks = [
                SKIN._space._adjust.high,
                SKIN._space._adjust.normal,
                SKIN._space._adjust.low,
                SKIN._space._adjustBG 
//                SKIN._space._adjust.page

            ];
*/
        if (schemeOverlayIsReady) { // if this is NOT the initial control instance valueChanges, there should be a block index

            // update the color space based on the new block adjust values
            SKIN.initColorSpace();

            // doesn't work
            //SKIN.render(KEY_COLOR.block.highest.background);

            // doesn't seem to work.
            //SKIN.options.scheme = SCHEME_CUSTOM; // MATT REVIEW: the local my scheme object. instead of skin.initcolorspace().

            updateColors();

            // update the swatch bkg color
            Y.one('.schemer-swatch').setStyle('backgroundColor', schemeBlockDOM.getStyle('backgroundColor'));
        }
    }


    var overlaySchemer = new Y.Overlay({
        srcNode:"#schemer-outer",
//         width: "600px",
//         height:"300px",
//           xy: 

//        xy: [-800, 200]
    });
    overlaySchemer.render();
    overlaySchemer.hide();

    var ddSchemer = new Y.DD.Drag({
        node: '#schemer-outer'
    });


    // controls inside the scheme creator overlay //
    var keyHue = 0,
        dialSchemeHue = new Y.Dial({
            min:-360,
            max:360,
            stepsPerRevolution:360,
            value: keyHue,
            strings:{label:'Hue:', resetStr: 'Reset', tooltipHandle: 'Drag to set'},
            after : {
                valueChange: function (e) {
                    blockAdjust.h = e.newVal;
                    handleSchemeValueChange();
                }
            }
    });
    dialSchemeHue.render('#dial-scheme-hue');

    var keySat = 23,
        sliderSchemeSat = new Y.Slider({
            axis  : 'x',
            length: '100px',
            min   : -100,
            max   : 100,
            value : keySat,
            after : {
                valueChange: function (e) {
                    Y.one('.sat-output').setHTML(e.newVal);
                    blockAdjust.s = e.newVal;
                    handleSchemeValueChange();
                }
            }
    });
    sliderSchemeSat.render('#slider-scheme-sat');
    Y.one('.sat-output').setHTML(keySat);

    var keyLit = 13,
        sliderSchemeLit = new Y.Slider({
            axis  : 'x',
            length: '100px',
            min   : -100,
            max   : 100,
            value : keyLit,
            after : {
                valueChange: function (e) {
                    Y.one('.lit-output').setHTML(e.newVal);
                    blockAdjust.l = e.newVal;
                    handleSchemeValueChange();
                }
            }
    });

    sliderSchemeLit.render('#slider-scheme-lit');
    Y.one('.lit-output').setHTML(keyLit);

    var showSchemer = function(e) {
        var relX = (e.clientX + Y.one('document').get('scrollLeft')),
            relY = (e.clientY + Y.one('document').get('scrollTop')),
            bucketHex,
            space = SKIN.colorspace,
            block = SKIN.colorspace.block;

            overlayPicker.hide();
            if (Y.one('.bucket-selected')) {
                Y.one('.bucket-selected').removeClass('bucket-selected');
            }
            e.target.addClass('bucket-selected');

        schemeBlockDOM = e.target.ancestor('.block'); // Used for getting color for swatch in overlay

        // For case of multiple buckets to click on
        // we need to update the color picker display on picker show
        // also set the var objBucket, which is the DOM obj to receive the new color
        if (e.currentTarget.hasClass('bucket-high')){
            blockAdjust = SCHEME_CUSTOM.high;
            bucketHex = block.high.background;
        }else if (e.currentTarget.hasClass('bucket-normal')){
            blockAdjust = SCHEME_CUSTOM.normal;
            bucketHex = block.normal.background;
        }else if (e.currentTarget.hasClass('bucket-low')){
            blockAdjust = SCHEME_CUSTOM.low;
            bucketHex = block.low.background;
        }else if (e.currentTarget.hasClass('bucket-lowest')){
            blockAdjust = SCHEME_CUSTOM.background;
            bucketHex = space.background;
            schemeBlockDOM = Y.one('.color-space .background'); // special case for lowest because of nesting in a parent div with other blocks, need to pick up the bkg color of the parent div
        }
        overlaySchemer.show();

        // set UI to match color of bucket value clicked on
        Y.one('.schemer-key').setStyle('backgroundColor', space.block.highest.background);
        Y.one('.schemer-swatch').setStyle('backgroundColor', bucketHex);

        // needed so that handleSchemeValueChange() won't adjust the colors until 
        //all three, h, s, l, controls are initialized with the new values for the selected block.
        schemeOverlayIsReady = false; 

        // set dial and sliders with current H, S, L of the main color that is the
        // parent of the color icon clicked on.

        dialSchemeHue.set('value', blockAdjust.h);
        sliderSchemeSat.set('value', blockAdjust.s);
        sliderSchemeLit.set('value', blockAdjust.l);
        schemeOverlayIsReady = true;
        overlaySchemer.move([(relX + 50), (relY - 10)]);

    };
    Y.one('#schemer-outer .close').on('click', function(e){
        overlaySchemer.hide();
        // remove the selected class from scheme icons
        Y.one('.bucket-selected').removeClass('bucket-selected');
    });


    Y.all('.bucket-scheme').on('click', showSchemer);

    ////////////////////  END scheme creator overlay  /////////////////////////////

    

    Y.one('#hs').on('click', handlePicker);
    Y.one('#sliderL').on('click', handleLight);
    Y.one('.picker-input').on('blur', handlePickerInputBlur);
    Y.one('#picker-outer .close').on('click', function(e){
        overlayPicker.hide();
        Y.one('.bucket-selected').removeClass('bucket-selected');
    });



    Y.one('.inp-skin-name').on('blur', function(e) {
        var body = Y.one('body');
        // sets the skin name and class prefix that will be replaced in all the
        // stylesheet templates
        SKIN.options.name = Y.Escape.html(Y.one('.inp-skin-name').get('value'));
        body.setAttribute('class', '');
        body.addClass(SKIN.options.prefix.substring(1) + SKIN.options.skinPrefix + SKIN.options.name);

        // Then we need to do refresh[component]Skin() function calls
        // Which are found in updateColors();
        // This will send the skin name into the Widget Maps -> Stylesheet Templates -> CSS
        updateColors();
    });

    Y.all('.bucket-picker').on('click', showPicker);
    Y.one('.page-background').setStyle('backgroundColor', PAGE_BG_COLOR);


    Y.one('.block.background').on('mouseenter', function(e){
        e.target.addClass('show-hover');
    });
    Y.one('.block.background').on('mouseout', function(e){
        e.target.removeClass('show-hover');
    });


    overlay.move([anchorOverlay.getX(),  anchorOverlay.getY()] );
    panel.move([anchorPanel.getX(),  anchorPanel.getY()] );
    
    Y.on("windowresize", function(){
        overlay.move([anchorOverlay.getX(),  anchorOverlay.getY()] );
        panel.move([anchorPanel.getX(),  anchorPanel.getY()] );
    });
    Y.one('#tabview-controls a').prepend('<img src="assets/images/picker_icon.png" width="14" height="14"/>');

    Y.one('.tab-schemes').on('click', function(){
        overlayPicker.hide();
        overlaySchemer.hide();
        updateSchemePreviews();
        if (Y.one('.bucket-selected')) {
            Y.one('.bucket-selected').removeClass('bucket-selected');
        }
    
    });
    Y.one('.tab-code').on('click', function(){
        overlayPicker.hide();
        overlaySchemer.hide();
        updateTextAreaSettings();
    
    });
});
