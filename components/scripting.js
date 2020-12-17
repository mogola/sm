
const FacebookScript = () => {
    return (
        <script dangerouslySetInnerHTML={{__html:`
                window.fbAsyncInit = function() {
                    FB.init({
                    appId      : '${3587318871321107}',
                    cookie     : true,
                    xfbml      : true,
                    version    : '${"v.9.0"}'
                    });

                    FB.AppEvents.logPageView();
                };

                (function(d, s, id){
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement(s); js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));`
        }} ></script>
    )
}

export {
    FacebookScript
}