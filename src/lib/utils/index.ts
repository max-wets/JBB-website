export const urlStringFormatter = (title: string, id: number | string) => {
  const urlArr = title.toLocaleLowerCase().split(" ");
  const regex = new RegExp("\\w+");
  const filteredUrlArr = urlArr.filter((str) => regex.test(str));
  const cleanedUrlArr = filteredUrlArr.map((str) => {
    let newStr = "";
    const bannedCharsRegex = new RegExp("[,.']");
    for (let char of str) {
      if (!bannedCharsRegex.test(char)) {
        newStr += char;
      }
    }
    return newStr;
  });
  return encodeURIComponent(cleanedUrlArr.join("-").concat(`-${id}`));
};
