export interface SessionUser {
  id?: number;
  name?: string;
  email?: string;
  image?: string;
  accessToken?: string;
}

export interface SessionUser {
  user: UserApi;
  jwt: string;
}

export interface ApiResource {
  id: number;
  documentId: string;
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
  medium?: ImageFormatApi;
}

export interface ImageApi extends ApiResource {
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

export interface CategoryApi extends ApiResource {
  Name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ProductApi extends ApiResource {
  Name: string;
  Intro: string | null;
  Price: number;
  Description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Image: ImageApi;
  item_categories: CategoryApi[];
}

export interface PostCommentApi extends ApiResource {
  id: number;
  documentId: string;
  ArticleID: number;
  AuthorID: number;
  Content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  authorUsername: string | null;
}

export interface BlogPostApi extends ApiResource {
  Name: string;
  Intro: string | null;
  Description: string;
  Video_URL: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Image: ImageApi;
  article_categories: CategoryApi[];
  comments: PostCommentApi[];
}

export interface ApiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ApiMetadata {
  pagination: ApiPagination;
}

export interface ApiData<T> {
  data: T;
}

export interface ApiDataArray<T> {
  data: T[];
}

export interface ApiResponse<T> extends ApiDataArray<T> {
  meta: ApiMetadata;
}

export interface ApiUpdateResponse<T> extends ApiData<T> {
  meta: ApiMetadata;
}

export interface BlogPostSmall {
  id: number | string;
  documentId: string;
  title: string;
  issueDate: string;
  imageUrl: string | null;
}

export interface BlogPost extends BlogPostSmall {
  intro: string | null;
  description: string;
  videoUrl: string;
  categories: string[];
}

export type PrevNextPost = {
  id: number;
  documentId: string;
  title: string;
};

export interface PostComment {
  id: number;
  documentId: string;
  ArticleID: number;
  AuthorID: number;
  Content: string;
  issueDate: string;
  AuthorName: string | null;
}

export interface UserApi {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ActiveCategories = {
  [category: string]: number;
};

export interface Product {
  id: string;
  documentId: string;
  name: string;
  intro: string | null;
  description: string;
  price: number;
  issueDate: string;
  imageUrl: string;
  categories: string[];
}

export type PrevNextProduct = {
  id: number;
  documentId: string;
  title: string;
  imageUrl: string;
};

export type PreviousAndNextBlogPosts = {
  previousPost: PrevNextPost | null;
  nextPost: PrevNextPost | null;
};
