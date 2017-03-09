require 'graphql'
require 'faraday'

introspection_query = GraphQL::Introspection::INTROSPECTION_QUERY.gsub("\n", "")
response = Faraday.post(
  "#{ENV['IDOBATA_URL']}/api/graphql",
  {'query' => introspection_query},
  {'Authorization' => "Bearer #{ENV['IDOBATA_API_TOKEN']}"}
);
File.write('schema.json', response.body)
