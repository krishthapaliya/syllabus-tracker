import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ListPublicMovieListsData {
  movieLists: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    user: {
      displayName: string;
    };
  } & MovieList_Key)[];
}

export interface MovieListEntry_Key {
  movieListId: UUIDString;
  movieId: UUIDString;
  __typename?: 'MovieListEntry_Key';
}

export interface MovieList_Key {
  id: UUIDString;
  __typename?: 'MovieList_Key';
}

export interface Movie_Key {
  id: UUIDString;
  __typename?: 'Movie_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Watch_Key {
  id: UUIDString;
  __typename?: 'Watch_Key';
}

interface ListPublicMovieListsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicMovieListsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicMovieListsData, undefined>;
  operationName: string;
}
export const listPublicMovieListsRef: ListPublicMovieListsRef;

export function listPublicMovieLists(options?: ExecuteQueryOptions): QueryPromise<ListPublicMovieListsData, undefined>;
export function listPublicMovieLists(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPublicMovieListsData, undefined>;

