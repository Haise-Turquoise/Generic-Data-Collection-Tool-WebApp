export const isObjectEmpty = object => {
  for (const key in object) {
    if (object.hasOwnProperty(key)) return false;
  }

  return true;
};

export const DnDReorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const memoizeFunction = f => {
  return function () {
    const args = Array.prototype.slice.call(arguments);

    // we've confirmed this isn't really influencing
    // speed positively
    f.memoize = f.memoize || {};

    // this is the section we're interested in
    return args in f.memoize ? f.memoize[args] : (f.memoize[args] = f.apply(this, args));
  };
};

export const calculateOptions = (itemCount) => {
  let length = itemCount;
  if (length > 100) length = 100;
  else if (length == 0) length = 1;
  const sizeOptions = [10, 25, 50, 100, itemCount];
  sizeOptions.sort((a, b) => a - b);
  return {
    actionsColumnIndex: -1,
    search: true,
    showTitle: false,
    maxBodyHeight: "400px",
    pageSizeOptions: sizeOptions,
    pageSize: length,
    addRowPosition: "first"
  };
};

export const urlParser = (orgId, categories, attributes)=>{
  let baseUrl = "https://gdctrest.azurewebsites.net/mastervalues/all?organization=";
  let UrlWithOrg = baseUrl + orgId +"&categories=";
  categories.forEach((entry)=>{
    UrlWithOrg = UrlWithOrg + entry + ",";
  });
  
  let UrlWithCategories = UrlWithOrg.slice(0, -1) + "&attributes=";
  
  attributes.forEach((entry)=>{
    UrlWithCategories = UrlWithCategories + entry + ",";
  });
  console.log(UrlWithCategories.slice(0, -1));
  return UrlWithCategories.slice(0, -1);
}

export const digitToAlpha = (num)=>{
  let str="";
  while (num > 0){
    let m = num % 26;
    if (m == 0){
        m = 26;
    }
    str = String.fromCharCode(m + 64) + str;
    num = (num - m) / 26;
  }
  return str;
}
