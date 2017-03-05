require 'graphql'
require 'faraday'

introspection_query = GraphQL::Introspection::INTROSPECTION_QUERY.gsub("\n", "")
response = Faraday.post(
  ENV['GRAPHQL_URL'],
  {'query' => introspection_query},
  {'Authorization' => 'Bearer 81bcbb78a5041b8c0a69ed163458661b2c0f3ca27031d8b2bb236f2c4881fe68'}
);
File.write('schema.json', response.body)
