const { queryRef, executeQuery, validateArgsWithOptions, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'frontend',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const listPublicMovieListsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicMovieLists');
}
listPublicMovieListsRef.operationName = 'ListPublicMovieLists';
exports.listPublicMovieListsRef = listPublicMovieListsRef;

exports.listPublicMovieLists = function listPublicMovieLists(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listPublicMovieListsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
