export const useFormattedColors = (color: string) => {
  switch (color) {
    case "#FF0000":
      return "#f54556";
    case "#FFD700":
      return "#15d696";
    case "#808080":
      return color;
    default:
      return color;
  }
};
