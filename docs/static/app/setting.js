window.globalObject = {
    constant: {},
    base_api_url: "https://osm.japp.cc/api"
};

if( !window.localStorage.getItem("server_api")){
    window.localStorage.setItem("server_api",window.globalObject.base_api_url)
}else{
    window.globalObject.base_api_url = window.localStorage.getItem("server_api")
}
