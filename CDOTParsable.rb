require 'nokogiri'
require 'rgeo'
require 'rgeo-geojson'
require 'json'

module CDOTParsable
    def self.generate_weather_stations
        File.open('static/stations.json', 'w') {|file| file.truncate(0) }
        @doc = Nokogiri::XML(File.open("data/weatherstation.xml"))
        station_entries = []
        @doc.xpath('//ws:WeatherStation').each do |station|
            #Configure GeoJSON geometry
            lat = station.xpath('ws:Location/global:Latitude').text
            lon = station.xpath('ws:Location/global:Longitude').text
            station_name = station.xpath('ws:Device/global:CommonName').text
            factory = RGeo::Geographic.spherical_factory
            coordinates = factory.point(lon, lat)
            
            #Set up GeoJSON Properties
            properties = Hash.new

            station.xpath('ws:Camera/camera:CameraView').each do |camera|
                key = camera.xpath('camera:ViewDescription').text + "Image"
                image_location = camera.xpath('camera:ImageLocation').text
                image_location = "http://cotrip.org/" + image_location
                properties[key.to_sym] = image_location
            end
            station.xpath('ws:WeatherInfo').each do |weather_info|
                key = "CurrentTemp"
                temp = weather_info.xpath('ws:EssAirTemp').text
                properties[key.to_sym] = temp

                key = "MaxTemp"
                max_temp = weather_info.xpath('ws:EssMaxTemp').text
                properties[key.to_sym] = max_temp

                key = "MinTemp"
                min_temp = weather_info.xpath('ws:EssMinTemp').text
                properties[key.to_sym] = min_temp

                key = "AvgWS"
                avg_ws = weather_info.xpath('ws:EssAvgWindSpeed').text
                properties[key.to_sym] = avg_ws

                key = "EstPrecip"
                est_precip = weather_info.xpath('ws:EssPrecip24Hr').text
                properties[key.to_sym] = est_precip
            end


            #Encode final GEOJSON Feature
            feature = RGeo::GeoJSON::Feature.new(coordinates, station_name, properties)
            geo_entry = RGeo::GeoJSON.encode(feature)
            station_entries << geo_entry.to_json
        end
        File.open("static/stations.json", "a+") do |file|
            file.puts("[" + station_entries.join(", ") + "]")
        end
    end
end