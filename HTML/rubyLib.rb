#!/usr/bin/env ruby
require "nokogiri"
require "open-uri"
require "net/https"
require "mini_magick"
require "json"

brand = "www.chienchatetcompagnie.com"

url  = "https://#{brand}/fr/"
path = "xxx/xxx/xxx/"
ext  = ".html"
# recup des refpk ref depuis source.json
file = File.read("source.json")
data = JSON.parse(file)
ref = data["refPk"]

# one ary by chunk [URL,LIB,PRICE]
aryUrl = Array.new
aryLib = Array.new
aryPri = Array.new

# build full URL
ref.each {|i|
  aryUrl.push(url+path+i+ext)
}
# get full html of URL above then get lib
aryUrl.each {|i|
  # puts i
  aryLib.push( Nokogiri::HTML(open(i,  :ssl_verify_mode => OpenSSL::SSL::VERIFY_NONE)).at_css("#ctl00_ContentPlaceHolder1_LB_TITRE_PRODUIT").text.encode('iso-8859-1'))
  aryPri.push( Nokogiri::HTML(open(i,  :ssl_verify_mode => OpenSSL::SSL::VERIFY_NONE)).at_css("#ctl00_ContentPlaceHolder1_LAB_PRIX_PRODUIT").text.encode('iso-8859-1'))
}

# hash lib
cpt = 0
varLib = ''
aryLib.each { |i|
  if cpt == 0
    varLib += "- $putLib = ["
  end
  varLib += '"' + i + '"'
  if cpt < aryLib.length-1
    varLib += ", "
  end
  cpt+=1
}
varLib += "]"
txt = "_varLib << #{varLib} "
txt = txt.encode('iso-8859-1')
# puts "#{txt}"

# hash price
cptPri = 0
varPri = ''
aryPri.each { |i|
  if cptPri == 0
    varPri += "- $putPri = ["
  end
  varPri += '"' + i + '"'
  if cptPri < aryLib.length-1
    varPri += ", "
  end
  cptPri+=1
}
varPri += "]"
txt = "_varPri << #{varPri} "
txt = txt.encode('iso-8859-1')
# puts "#{txt}"

# create ref array + ary nbpk
cpt2    = 0
varNbpk = ''
varRef  = ''
ref.each{ |i|
  if cpt2 == 0
    varNbpk += "- $nbpk   = ["
    varRef += "- $ref    = ["
  end
  # varNbpk += '"' + cpt2 + '"'
  varNbpk += (cpt2+1).to_s
  varRef += '"' + i + '"'
  if cpt2 < ref.length-1
    varNbpk += ", "
    varRef += ", "
  end
  cpt2+=1
}
varNbpk += "]"
varRef += "]"
# puts varRef

# écriture _varLib.slim ["$nbpk", "$putLib", "$putPri", "$ref"]
output = File.open( "src/FR/var/_varLib.slim","w" )
output << varNbpk + "\n"
output << varLib + "\n"
output << varPri + "\n"
output << varRef + "\n"
output.close

cpti = 1

ref.each {|i|
  # i = ref[0]
  # get online image to save on src/FR/images
  File.open("src/FR/images/pk#{cpti}.jpg", "wb") do |saved_file|
    # print "open ?:pk#{cpti} "
    # the following "open" is provided by open-uri
    open("https://#{brand}/Visuels/Produits/zoom/#{i}_WEB1.jpg", "rb") do |read_file|
      # print "saved_file:#{i}_WEB1.jpg"
      saved_file.write(read_file.read)
    end
  end

  # ATTENTION CHECK convert -version IN CLI -> image.width | path | .format "png" | resolution
  image = MiniMagick::Image.new("src/FR/images/pk#{cpti}.jpg")

  image.combine_options do |b|
    b.resize "600x400"
    b.quality "100" # 86 = q:79 fw info
  end

  cpti+=1
}
