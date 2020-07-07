// https://github.com/Tomekmularczyk/react-id-generator
let globalPrefix = 'id';
let lastId = 0;
export default function nextId(localPrefix?: string | null): string {
  // eslint-disable-next-line no-plusplus
  lastId++;
  return `${localPrefix || globalPrefix}${lastId}`;
}

export const resetId = (): void => {
  lastId = 0;
};

export const setPrefix = (newPrefix: string): void => {
  globalPrefix = newPrefix;
};
