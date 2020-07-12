# TODO: Create JSON object of memes to return

# [START gae_flex_storage_app]
require "sinatra"
require "google/cloud/storage"
require "json"

storage = Google::Cloud::Storage.new
bucket  = storage.bucket ENV["GOOGLE_CLOUD_STORAGE_BUCKET"]

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
    files   = bucket.files prefix: "AllMemes/Sadcat"
    files.each do |file|
        puts file.name
end

# List files in Unforgivable, generate and return JSON
get "/unforgivable" do
    files   = bucket.files prefix: "AllMemes/Unforgivable"
    files.each do |file|
        puts file.name
end

# List files in Bait Memes, generate and return JSON
get "/bait" do
    files   = bucket.files prefix: "AllMemes/baitMemes"
    files.each do |file|
        puts file.name
end

# List files in Randome Memes, generate and return JSON
get "/random" do
    memeArray = getMemes("AllMemes/memes")
end

def getMemes (filesPrefix)
    files   = bucket.files prefix: filesPrefix
    NumberOfFiles = files.length()
    ReturnMemes=Array.new
    if NumberOfFiles < 24
        NumberOfFiles = 24
    for i in 0..NumberOfFiles
        meme = files.sample
        files.delete(meme)
        ReturnMemes.push("https://storage.googleapis.com/memeservices-storage/AllMemes/"+meme.name)
    end
end

# [END gae_flex_storage_app]