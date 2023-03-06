
// This function converts an excel color index to a hex color stringthis.Data..
// See https://stackoverflow.com/questions/14996977/convert-excel-color-index-to-hex



class IndexedColors {

    indexMap = new Map();
    themeMap = [
        "000000",
        "FFFFFF",
        "E7E6E6",
        "44546A",
        "4472C4",
        "ED7D31",
        "A5A5A5",
        "FFC000",
        "5B9BD5",
        "70AD47",
        "0563C1"
    ];

    constructor() {
        this.indexMap.set("0", "000000");
        this.indexMap.set("1", "FFFFFF");
        this.indexMap.set("2", "FF0000");
        this.indexMap.set("3", "00FF00");
        this.indexMap.set("4", "0000FF");
        this.indexMap.set("5", "FFFF00");
        this.indexMap.set("6", "FF00FF");
        this.indexMap.set("7", "00FFFF");
        this.indexMap.set("8", "000000");
        this.indexMap.set("9", "FFFFFF");
        this.indexMap.set("10", "FF0000");
        this.indexMap.set("11", "00FF00");
        this.indexMap.set("12", "0000FF");
        this.indexMap.set("13", "FFFF00");
        this.indexMap.set("14", "FF00FF");
        this.indexMap.set("15", "00FFFF");
        this.indexMap.set("16", "800000");
        this.indexMap.set("17", "008000");
        this.indexMap.set("18", "000080");
        this.indexMap.set("19", "808000");
        this.indexMap.set("20", "800080");
        this.indexMap.set("21", "008080");
        this.indexMap.set("22", "C0C0C0");
        this.indexMap.set("23", "808080");
        this.indexMap.set("24", "9999FF");
        this.indexMap.set("25", "993366");
        this.indexMap.set("26", "FFFFCC");
        this.indexMap.set("27", "CCFFFF");
        this.indexMap.set("28", "660066");
        this.indexMap.set("29", "FF8080");
        this.indexMap.set("30", "0066CC");
        this.indexMap.set("31", "CCCCFF");
        this.indexMap.set("32", "000080");
        this.indexMap.set("33", "FF00FF");
        this.indexMap.set("34", "FFFF00");
        this.indexMap.set("35", "00FFFF");
        this.indexMap.set("36", "800080");
        this.indexMap.set("37", "800000");
        this.indexMap.set("38", "008080");
        this.indexMap.set("39", "0000FF");
        this.indexMap.set("40", "00CCFF");
        this.indexMap.set("41", "CCFFFF");
        this.indexMap.set("42", "CCFFCC");
        this.indexMap.set("43", "FFFF99");
        this.indexMap.set("44", "99CCFF");
        this.indexMap.set("45", "FF99CC");
        this.indexMap.set("46", "CC99FF");
        this.indexMap.set("47", "FFCC99");
        this.indexMap.set("48", "3366FF");
        this.indexMap.set("49", "33CCCC");
        this.indexMap.set("50", "99CC00");
        this.indexMap.set("51", "FFCC00");
        this.indexMap.set("52", "FF9900");
        this.indexMap.set("53", "FF6600");
        this.indexMap.set("54", "666699");
        this.indexMap.set("55", "969696");
        this.indexMap.set("56", "003366");
        this.indexMap.set("57", "339966");
        this.indexMap.set("58", "003300");
        this.indexMap.set("59", "333300");
        this.indexMap.set("60", "993300");
        this.indexMap.set("61", "993366");
        this.indexMap.set("62", "333399");
        this.indexMap.set("63", "333333");
    }

    excelColorIndexToHex(index: number): string {
        if (index < 0 || index > 63) {
            throw new Error("Invalid color index");
        }
        // return converted data
        return this.indexMap.get(index.toString());
    }

    excelColorThemeToHex(ind: number): string {
        return this.themeMap[ind];
    }
};

export default IndexedColors;