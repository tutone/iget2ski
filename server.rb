require 'sinatra'

set :public_folder, Proc.new { File.join(root, "static") }
set :destination, "default"

get '/' do
  erb :index
end

get '/vail' do
  set :destination, "Vail"
  erb :mapquest
end

get '/breckinridge' do
  set :destination, "Breckenridge"
  erb :mapquest
end

get '/keystone' do
  set :destination, "Keystone"
  erb :mapquest
end

get '/winterpark' do
  set :destination, "Winter Park"
  erb :mapquest
end

get '/stations' do
  erb :mapquest 
end