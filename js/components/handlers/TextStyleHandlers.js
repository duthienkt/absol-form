import Color from "absol/src/Color/Color";
var TextStyleHandlers = {};
TextStyleHandlers.textColor = {
    set: function (value) {
        var vColor;
        try {
            if (value instanceof Color) vColor = value;
            else if (typeof value === 'string') {
                vColor = Color.parse(value)
            }
            else vColor = new Color([0, 0, 0, 0]);
        } catch (err) {
            console.error(err);
            vColor = new Color([0, 0, 0, 0]);
        }
        value = vColor.toString('HEX8');
        this.domElt.addStyle('color', value);
        return value;
    },
    descriptor: {
        type: "color",
        sign: "TextColor"
    }
};

TextStyleHandlers.textSize = {
    set: function (value) {
        if (value > 0) {
            this.domElt.addStyle('font-size', value + 'px');
        }
        else {
            this.domElt.removeStyle('font-size');
            value = undefined;
        }

        return value;
    },
    descriptor: {
        type: "number",
        nullable: true,
        defaultValue: 14,
        sign: "FontSize"
    },
    export: function (ref) {
        return ref.get() || undefined;
    }
};

TextStyleHandlers.font = {
    set: function (value) {
        if (value && value !== 'None')
            this.domElt.addStyle('font-family', value);
        else
            this.domElt.removeStyle('font-family');
        return value;
    },
    descriptor: {
        type: "font",
        sign: 'TextFont'
    }
};

TextStyleHandlers.fontStyle = {
    set: function (value) {
        if (!fontStyle2DomStyle[value]) value = 'Regular';
        this.domElt.addStyle(fontStyle2DomStyle[value] || fontStyle2DomStyle.Regular);
    },
    descriptor: {
        type: "enum",
        values: ['Regular',
            'Italic', 'Bold', 'Bold italic'],
        sign: 'FontStyle'
    },
    export: function () {
        var value = arguments[arguments.length - 1].get();
        if (value === 'Regular') return undefined;
        return value;
    }
};

export var fontStyle2DomStyle = {
    Regular: {
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    Bold: {
        fontWeight: 'bold',
        fontStyle: 'normal'
    },
    'Bold italic': {
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    Italic: {
        fontWeight: 'normal',
        fontStyle: 'italic'
    }
};

TextStyleHandlers.textAlign = {
    set: function (value) {
        if (['left', 'center', 'right'.indexOf(value) >= 0])
            this.domElt.addStyle('text-align', value);
        else
            this.domElt.addStyle('text-align', 'left');
        return value;
    },
    descriptor: {
        type: "textAlign",
        sign: "TextAlign"
    }
};

export default TextStyleHandlers;