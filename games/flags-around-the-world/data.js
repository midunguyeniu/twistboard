/* Nhớ cờ thế giới: dữ liệu 195 nước (193 nước thành viên Liên Hợp Quốc + 2 quan sát viên: Vatican, Palestine).
   Mỗi dòng: "mã ISO 2 chữ|tên tiếng Việt|tên tiếng Anh". Ảnh cờ: flags/<mã>.svg (flag-icons, MIT).
   FLAG_LOOK: các nhóm cờ na ná nhau (mình tự lập), dùng cho mức Khó: chiếu liền nhau + trộn vào trang chọn.
   Dùng chung cho trang game và tools/test-flags-around-the-world.js. */
var FLAG_DATA = [
  "af|Afghanistan|Afghanistan", "al|Albania|Albania", "dz|Algeria|Algeria", "ad|Andorra|Andorra", "ao|Angola|Angola",
  "ag|Antigua và Barbuda|Antigua and Barbuda", "ar|Argentina|Argentina", "am|Armenia|Armenia", "au|Úc|Australia", "at|Áo|Austria",
  "az|Azerbaijan|Azerbaijan", "bs|Bahamas|Bahamas", "bh|Bahrain|Bahrain", "bd|Bangladesh|Bangladesh", "bb|Barbados|Barbados",
  "by|Belarus|Belarus", "be|Bỉ|Belgium", "bz|Belize|Belize", "bj|Bénin|Benin", "bt|Bhutan|Bhutan",
  "bo|Bolivia|Bolivia", "ba|Bosnia và Herzegovina|Bosnia and Herzegovina", "bw|Botswana|Botswana", "br|Brazil|Brazil", "bn|Brunei|Brunei",
  "bg|Bulgaria|Bulgaria", "bf|Burkina Faso|Burkina Faso", "bi|Burundi|Burundi", "cv|Cabo Verde|Cabo Verde", "kh|Campuchia|Cambodia",
  "cm|Cameroon|Cameroon", "ca|Canada|Canada", "cf|Cộng hoà Trung Phi|Central African Republic", "td|Tchad|Chad", "cl|Chile|Chile",
  "cn|Trung Quốc|China", "co|Colombia|Colombia", "km|Comoros|Comoros", "cg|Cộng hoà Congo|Republic of the Congo", "cd|CHDC Congo|DR Congo",
  "cr|Costa Rica|Costa Rica", "ci|Bờ Biển Ngà|Côte d'Ivoire", "hr|Croatia|Croatia", "cu|Cuba|Cuba", "cy|Síp|Cyprus",
  "cz|Séc|Czechia", "dk|Đan Mạch|Denmark", "dj|Djibouti|Djibouti", "dm|Dominica|Dominica", "do|Cộng hoà Dominica|Dominican Republic",
  "ec|Ecuador|Ecuador", "eg|Ai Cập|Egypt", "sv|El Salvador|El Salvador", "gq|Guinea Xích Đạo|Equatorial Guinea", "er|Eritrea|Eritrea",
  "ee|Estonia|Estonia", "sz|Eswatini|Eswatini", "et|Ethiopia|Ethiopia", "fj|Fiji|Fiji", "fi|Phần Lan|Finland",
  "fr|Pháp|France", "ga|Gabon|Gabon", "gm|Gambia|Gambia", "ge|Gruzia|Georgia", "de|Đức|Germany",
  "gh|Ghana|Ghana", "gr|Hy Lạp|Greece", "gd|Grenada|Grenada", "gt|Guatemala|Guatemala", "gn|Guinée|Guinea",
  "gw|Guinea-Bissau|Guinea-Bissau", "gy|Guyana|Guyana", "ht|Haiti|Haiti", "hn|Honduras|Honduras", "hu|Hungary|Hungary",
  "is|Iceland|Iceland", "in|Ấn Độ|India", "id|Indonesia|Indonesia", "ir|Iran|Iran", "iq|Iraq|Iraq",
  "ie|Ireland|Ireland", "il|Israel|Israel", "it|Ý|Italy", "jm|Jamaica|Jamaica", "jp|Nhật Bản|Japan",
  "jo|Jordan|Jordan", "kz|Kazakhstan|Kazakhstan", "ke|Kenya|Kenya", "ki|Kiribati|Kiribati", "kp|Triều Tiên|North Korea",
  "kr|Hàn Quốc|South Korea", "kw|Kuwait|Kuwait", "kg|Kyrgyzstan|Kyrgyzstan", "la|Lào|Laos", "lv|Latvia|Latvia",
  "lb|Liban|Lebanon", "ls|Lesotho|Lesotho", "lr|Liberia|Liberia", "ly|Libya|Libya", "li|Liechtenstein|Liechtenstein",
  "lt|Litva|Lithuania", "lu|Luxembourg|Luxembourg", "mg|Madagascar|Madagascar", "mw|Malawi|Malawi", "my|Malaysia|Malaysia",
  "mv|Maldives|Maldives", "ml|Mali|Mali", "mt|Malta|Malta", "mh|Quần đảo Marshall|Marshall Islands", "mr|Mauritanie|Mauritania",
  "mu|Mauritius|Mauritius", "mx|Mexico|Mexico", "fm|Micronesia|Micronesia", "md|Moldova|Moldova", "mc|Monaco|Monaco",
  "mn|Mông Cổ|Mongolia", "me|Montenegro|Montenegro", "ma|Maroc|Morocco", "mz|Mozambique|Mozambique", "mm|Myanmar|Myanmar",
  "na|Namibia|Namibia", "nr|Nauru|Nauru", "np|Nepal|Nepal", "nl|Hà Lan|Netherlands", "nz|New Zealand|New Zealand",
  "ni|Nicaragua|Nicaragua", "ne|Niger|Niger", "ng|Nigeria|Nigeria", "mk|Bắc Macedonia|North Macedonia", "no|Na Uy|Norway",
  "om|Oman|Oman", "pk|Pakistan|Pakistan", "pw|Palau|Palau", "pa|Panama|Panama", "pg|Papua New Guinea|Papua New Guinea",
  "py|Paraguay|Paraguay", "pe|Peru|Peru", "ph|Philippines|Philippines", "pl|Ba Lan|Poland", "pt|Bồ Đào Nha|Portugal",
  "qa|Qatar|Qatar", "ro|Romania|Romania", "ru|Nga|Russia", "rw|Rwanda|Rwanda", "kn|Saint Kitts và Nevis|Saint Kitts and Nevis",
  "lc|Saint Lucia|Saint Lucia", "vc|Saint Vincent và Grenadines|Saint Vincent and the Grenadines", "ws|Samoa|Samoa", "sm|San Marino|San Marino", "st|São Tomé và Príncipe|São Tomé and Príncipe",
  "sa|Ả Rập Xê Út|Saudi Arabia", "sn|Sénégal|Senegal", "rs|Serbia|Serbia", "sc|Seychelles|Seychelles", "sl|Sierra Leone|Sierra Leone",
  "sg|Singapore|Singapore", "sk|Slovakia|Slovakia", "si|Slovenia|Slovenia", "sb|Quần đảo Solomon|Solomon Islands", "so|Somalia|Somalia",
  "za|Nam Phi|South Africa", "ss|Nam Sudan|South Sudan", "es|Tây Ban Nha|Spain", "lk|Sri Lanka|Sri Lanka", "sd|Sudan|Sudan",
  "sr|Suriname|Suriname", "se|Thuỵ Điển|Sweden", "ch|Thuỵ Sĩ|Switzerland", "sy|Syria|Syria", "tj|Tajikistan|Tajikistan",
  "tz|Tanzania|Tanzania", "th|Thái Lan|Thailand", "tl|Đông Timor|Timor-Leste", "tg|Togo|Togo", "to|Tonga|Tonga",
  "tt|Trinidad và Tobago|Trinidad and Tobago", "tn|Tunisia|Tunisia", "tr|Thổ Nhĩ Kỳ|Türkiye", "tm|Turkmenistan|Turkmenistan", "tv|Tuvalu|Tuvalu",
  "ug|Uganda|Uganda", "ua|Ukraina|Ukraine", "ae|Các Tiểu vương quốc Ả Rập Thống nhất|United Arab Emirates", "gb|Vương quốc Anh|United Kingdom", "us|Hoa Kỳ|United States",
  "uy|Uruguay|Uruguay", "uz|Uzbekistan|Uzbekistan", "vu|Vanuatu|Vanuatu", "ve|Venezuela|Venezuela", "vn|Việt Nam|Vietnam",
  "ye|Yemen|Yemen", "zm|Zambia|Zambia", "zw|Zimbabwe|Zimbabwe",
  "va|Vatican|Vatican City", "ps|Palestine|Palestine",
];
var FLAG_LOOK = [
  "td ro ad md",            // 3 sọc dọc xanh-vàng-đỏ
  "id mc pl sg",            // 2 sọc đỏ-trắng
  "nl lu ru si sk rs hr py", // 3 sọc ngang trắng-xanh-đỏ / đỏ-trắng-xanh
  "ie ci it mx",            // 3 sọc dọc xanh lá-trắng-cam/đỏ
  "in ne",                  // cam-trắng-xanh lá có hình tròn giữa
  "sn ml gn cm",            // 3 sọc dọc xanh lá-vàng-đỏ
  "gh bo lt et",            // 3 sọc ngang đỏ-vàng-xanh lá
  "au nz tv fj",            // cờ Anh góc trái, nền xanh
  "no is dk fi se",         // chữ thập Bắc Âu
  "ve ec co",               // vàng-xanh dương-đỏ
  "hn ni sv gt ar",         // xanh nhạt-trắng-xanh nhạt
  "jo ps sd kw ae",         // đỏ-trắng-đen-xanh lá
  "eg iq ye",               // 3 sọc ngang đỏ-trắng-đen (Syria đã đổi cờ mới nên không xếp vào đây)
  "qa bh",                  // răng cưa trắng
  "hu bg ir tj",            // 3 sọc ngang có xanh lá, trắng, đỏ
  "tr tn",                  // trăng lưỡi liềm + sao trên nền đỏ
  "my us lr",               // sọc đỏ trắng + góc xanh
  "ht li",                  // xanh dương trên, đỏ dưới
  "cu cl",                  // sao trắng trong hình đỏ/xanh + sọc
  "at lv lb",               // đỏ-trắng-đỏ
  "pk dz mr tm",            // trăng lưỡi liềm, nền xanh lá
  "cg tz kn",               // đường chéo
  "jp bd pw",               // hình tròn giữa
  "sl ga rw",               // 3 sọc ngang xanh lá-vàng/trắng-xanh dương
  "vn cn ma",               // sao trên nền đỏ
  "bj mg gw",               // sọc dọc bên trái + 2 sọc ngang
  "ke mw ss",               // đen-đỏ-xanh lá
  "be de",                  // đen-vàng-đỏ
  "bf gh",                  // đỏ-xanh lá có ngôi sao
  "kz pw so",               // nền xanh nhạt
  "ee bw sm",               // sọc xanh dương nhạt
  "mn kg",                  // đỏ có biểu tượng vàng
  "ph cz",                  // tam giác bên trái, 2 sọc ngang
  "nr so",                  // nền xanh dương, ngôi sao trắng
];
