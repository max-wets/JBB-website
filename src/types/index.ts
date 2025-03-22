export interface SessionUser {
  id?: number;
  name?: string;
  email?: string;
  image?: string;
  accessToken?: string;
}

export interface ImageFormatApi {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  provider_metadata: Record<string, string>;
}

export interface ImageFormatsApi {
  small: ImageFormatApi;
  thumbnail: ImageFormatApi;
  large?: ImageFormatApi;
  medium?: ImageFormatApi
}

export interface ImageApi {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: ImageFormatsApi;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryApi {
  Name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ProductApi {
  Name: string;
  Intro: string | null;
  Price: number;
  Description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Image: ApiData<ImageApi>
  item_categories: ApiDataArray<CategoryApi>
}

export interface PostCommentApi {
  ArticleID: number;
  AuthorID: number;
  Content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface BlogPostApi {
  Name: string;
  Intro: string | null;
  Description: string;
  Video_URL: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Image: ApiData<ImageApi>;
  article_categories: ApiDataArray<CategoryApi>;
  comments: ApiData<PostCommentApi>;
}

export interface ApiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number
}

export interface ApiMetadata {
  pagination: ApiPagination;
}

export interface ApiData<T> {
  data: ApiResource<T>
}

export interface ApiDataArray<T> {
  data: ApiResource<T>[]
}

export interface ApiResource<T> {
  id: number;
  attributes: T
}

export interface ApiResponse<T> extends ApiDataArray<T> {
  meta: ApiMetadata
}

export interface BlogPostSmall {
  id: number | string;
  title: string;
  issueDate: string;
  imageUrl: string | null;
}

export interface BlogPost extends BlogPostSmall {
  intro: string;
  description: string;
  videoUrl: string;
  categories: string[];
}

export interface PostComment {
  id: number; 
  ArticleID: number;
  AuthorID: number;
  Content: string;
  issueDate: string;
  AuthorName: string;
}
