
// This function converts an excel color index to a hex color stringthis.Data..
// See https://stackoverflow.com/questions/14996977/convert-excel-color-index-to-hex



class IndexedColors {

    Data= new Map();

    constructor() {
        this.Data.set("0", "000000");
        this.Data.set("1", "FFFFFF");
        this.Data.set("2", "FF0000");
        this.Data.set("3", "00FF00");
        this.Data.set("4", "0000FF");
        this.Data.set("5", "FFFF00");
        this.Data.set("6", "FF00FF");
        this.Data.set("7", "00FFFF");
        this.Data.set("8", "000000");
        this.Data.set("9", "FFFFFF");
        this.Data.set("10", "FF0000");
        this.Data.set("11", "00FF00");
        this.Data.set("12", "0000FF");
        this.Data.set("13", "FFFF00");
        this.Data.set("14", "FF00FF");
        this.Data.set("15", "00FFFF");
        this.Data.set("16", "800000");
        this.Data.set("17", "008000");
        this.Data.set("18", "000080");
        this.Data.set("19", "808000");
        this.Data.set("20", "800080");
        this.Data.set("21", "008080");
        this.Data.set("22", "C0C0C0");
        this.Data.set("23", "808080");
        this.Data.set("24", "9999FF");
        this.Data.set("25", "993366");
        this.Data.set("26", "FFFFCC");
        this.Data.set("27", "CCFFFF");
        this.Data.set("28", "660066");
        this.Data.set("29", "FF8080");
        this.Data.set("30", "0066CC");
        this.Data.set("31", "CCCCFF");
        this.Data.set("32", "000080");
        this.Data.set("33", "FF00FF");
        this.Data.set("34", "FFFF00");
        this.Data.set("35", "00FFFF");
        this.Data.set("36", "800080");
        this.Data.set("37", "800000");
        this.Data.set("38", "008080");
        this.Data.set("39", "0000FF");
        this.Data.set("40", "00CCFF");
        this.Data.set("41", "CCFFFF");
        this.Data.set("42", "CCFFCC");
        this.Data.set("43", "FFFF99");
        this.Data.set("44", "99CCFF");
        this.Data.set("45", "FF99CC");
        this.Data.set("46", "CC99FF");
        this.Data.set("47", "FFCC99");
        this.Data.set("48", "3366FF");
        this.Data.set("49", "33CCCC");
        this.Data.set("50", "99CC00");
        this.Data.set("51", "FFCC00");
        this.Data.set("52", "FF9900");
        this.Data.set("53", "FF6600");
        this.Data.set("54", "666699");
        this.Data.set("55", "969696");
        this.Data.set("56", "003366");
        this.Data.set("57", "339966");
        this.Data.set("58", "003300");
        this.Data.set("59", "333300");
        this.Data.set("60", "993300");
        this.Data.set("61", "993366");
        this.Data.set("62", "333399");
        this.Data.set("63", "333333");
    }
    
    excelColorIndexToHex(index: number): string {
        if (index < 0 || index > 63) {
            throw new Error("Invalid color index");
        }
        // return converted data
        return this.Data.get(index.toString());
    }
    
};

export default IndexedColors;