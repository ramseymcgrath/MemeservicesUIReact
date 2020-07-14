# TODO: Create JSON object of memes to return

# [START gae_standard_storage_app]
require "sinatra"
require "google/cloud/storage"
require "json"


storage = Google::Cloud::Storage.new
$bucket  = storage.bucket ENV["GOOGLE_CLOUD_STORAGE_BUCKET"]

get "/" do
  # Present the user with an upload form
  '
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="file">
      <input type="submit" value="Upload">
    </form>
  '
end

post "/upload" do
  #file_path = params[:file][:tempfile].path
  #file_name = params[:file][:filename]

  # Upload file to Google Cloud Storage bucket
  #file = bucket.create_file file_path, file_name, acl: "public"

  # The public URL can be used to directly access the uploaded file via HTTP
  #file.public_url
  '
  <p> Sorry, uploads disabled </p>
  '
end

# List files in sadcat, generate and return JSON
get "/sadcat" do
    #puts(headers)
    response.headers['allow_origin'] = "https://memeservices.com"
    response.headers['allow_methods'] = "GET,HEAD,POST"
    response.headers['allow_headers'] = "content-type,if-modified-since"
#    response.headers 'allow_credentials' => true
    response.headers['max_age'] = "1728000"
#    response.headers 'expose_headers' => "location,link"
#    puts(headers)
    content_type :json
    memeJson = getMemes("AllMemes/Sadcat")
    memeJson.to_json
end

# List files in Unforgivable, generate and return JSON
get "/unforgivable" do
    headers['allow_origin'] = "https://memeservices.com"
    headers['allow_methods'] = "GET,HEAD,POST"
    headers['allow_headers'] = "content-type,if-modified-since"
    headers['allow_credentials'] = true
    headers['max_age'] = "1728000"
    headers['expose_headers'] = "location,link"
    content_type :json
    memeJson = getMemes("AllMemes/Unforgivable")
    memeJson.to_json
end

# List files in Bait Memes, generate and return JSON
get "/bait" do
    headers['allow_origin'] = "https://memeservices.com"
    headers['allow_methods'] = "GET,HEAD,POST"
    headers['allow_headers'] = "content-type,if-modified-since"
    headers['allow_credentials'] = true
    headers['max_age'] = "1728000"
    headers['expose_headers'] = "location,link"
    content_type :json
    memeJson = getMemes("AllMemes/baitMemes")
    memeJson.to_json
end

# List files in Randome Memes, generate and return JSON
get "/random" do
    headers['allow_origin'] = "https://memeservices.com"
    headers['allow_methods'] = "GET,HEAD,POST"
    headers['allow_headers'] = "content-type,if-modified-since"
    headers['allow_credentials'] = true
    headers['max_age'] = "1728000"
    headers['expose_headers'] = "location,link"
    content_type :json
    memeJson = getMemes("AllMemes/memes")
    memeJson.to_json
end

def getMemes (filesPrefix)
    files   = $bucket.files prefix: filesPrefix
    @NumberOfFiles = files.length()
    @ReturnMemes=Array.new
    puts(@NumberOfFiles)
    if @NumberOfFiles > 24
        @NumberOfFiles = 25
    end
#    puts(@NumberOfFiles)
#    puts('Getting Random Memes')
    for i in 0..@NumberOfFiles-1
        meme = files.sample
#        puts('Meme: ')
#        puts(meme.name)
        files.delete(meme)
        @ReturnMemes.push("https://storage.googleapis.com/memeservices-storage/"+meme.name)
    end
#    puts('Generating JSON')
    @PictureJSONArray = Array.new
    @ReturnMemes.each do |memeUrl|
        pictureJSON = {
            'id' => memeUrl,
            'owner' => "Memeservices",
            'secret' => "00000",
            'farm' => 0,
            'category' => "Sadcat",
            'ispublic' => 1,
        }
        @PictureJSONArray.push(pictureJSON)
    end
    fullJson = {
        'photos' => {
        'page' => 1,
        'pages' => 1,
        'perpage' => 24,
        'total' => 24,
        'photo' => @PictureJSONArray
        }
    }
    return fullJson
end

# [END gae_standard_storage_app]