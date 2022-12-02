import { generateSlug } from './commonFuncs';

/**
 * @param  {unknown} filter
 */
export const mapDataFilter = (filter: unknown) => {
  const where = {};
  for (const [key, value] of Object.entries(filter)) {
    where[key] = {
      equals: value.Eq,
      not: value.Ne,
      in: value.In,
      notIn: value.NIn,
      contains: value.Ct,
      gt: value.Gt,
      gte: value.Gte,
      lt: value.Lt,
      lte: value.Lte,
      startsWith: value.Stw,
      endsWith: value.Enw,
      mode: value.Mode,
    };
  }
  return where;
};

/**
 * @param  {any} data
 */
export const mapImportMovies = (data: any) => ({
  Id: Number(data.Id),
  ...(Number(data.User_Ref) ? { User_Ref: Number(data.User_Ref) } : {}),
  Type: data.Type,
  Title: data.Title,
  Slug: data.Slug,
  Content: data.Content || '',
  Avatar: data.Avatar || '',
  Original: data.Original || data.Title || '',
  Quantity: Number(data.Quantity) || 0,
  Duration: Number(data.Duration) || 0,
  Publish: Number(data.Publish) || 0,
});

/**
 * @param  {any} data
 */
export const mapImportEpisodes = (data: any) => ({
  ...(Number(data.User_Ref) ? { User_Ref: Number(data.User_Ref) } : {}),
  Movie_Ref: Number(data.Movie_Ref),
  Title: data.Title,
  Slug: data.Slug || generateSlug(data.Title),
  Order: Number(data.Order) || 0,
  Source: data.Source,
  Server: data.Server || 'Common',
});
