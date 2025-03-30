export const urlStringFormatter = (title: string, documentId: string) => {
  const formattedName = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${formattedName}-${documentId}`;
};

export const newDate = (date: string): string => {
  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const nDate = new Date(date);
  return `${nDate.getDate()} ${mois[nDate.getMonth()]} ${nDate.getFullYear()}`;
};
