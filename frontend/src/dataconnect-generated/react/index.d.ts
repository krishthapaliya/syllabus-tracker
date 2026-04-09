import { ListPublicMovieListsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListPublicMovieLists(options?: useDataConnectQueryOptions<ListPublicMovieListsData>): UseDataConnectQueryResult<ListPublicMovieListsData, undefined>;
export function useListPublicMovieLists(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicMovieListsData>): UseDataConnectQueryResult<ListPublicMovieListsData, undefined>;
