!(async () => {
    let platform={
        "localhost:5500":"localhost",
        "127.0.0.1:5500":"localhost",
        "microblock.ink":"Github Pages",
    }[document.location.host]||"Unknown";
    if(document.location.host.includes("zeyu"))platform="WGzeyu"
    $(".meta").text(`版本：0.13，前端：MicroBlock，后端：WGzeyu，服务器：${platform}，数据源：QosmeticsDiscord.`)
    if(platform=="WGzeyu")$(".contact").text("If you don't want your models to appear on this website, please contact WGzeyu at Discord WGzeyu#7287 or 785777793@qq.com")

    function xss(str) {
        return str.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
            .replaceAll("\n", "<br>");
    }

    function md(str) {
        return xss(decodeUnicode(str))
            .replace(/__(.*?)__/g, "<i>$1</i>")
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    }

    function decodeUnicode(str) {
        return unescape(str.replace(/\\u/g, '%u'));
    }

    let sabersData = (await (await fetch("data/qsabers-web.json")).json())["model"],
        sabers=[],filters={},filteredHandle=()=>{sabers.sort((a,b)=>{ return b["uploadtime"]-a["uploadtime"]})};
    let handle=null;

    function filterModels(){
        sabers=[]
        model:for(let model of sabersData){
            for(let filter of Object.values(filters))
                if(!(filter(model)))continue model;
            sabers.push(model);
        }
        filteredHandle()
    }

    function initModels() {
        filterModels()
        $("#sabers").html("")
        let nowIndex = 0, maxIndex = 10;
        function loadModels() {
            while (maxIndex > nowIndex) {
                let model = sabers.shift();
                nowIndex++;
                let dom = $(`<div class="model">
            <div class="image">
                <img class="img" data-gisrc=''
                    data-gishow />
                    <div class="img-no-image">无图片</div>
            </div>
            <div class="id"></div>
            <div class="detail">
                <div class="information">
                    <div class="name"></div>
                    <div class="author"></div>
                </div>
                <div class="operations">
                    <button class="btn btn-icon more-information-btn">
                        <i class="icon ti ti-info-circle"></i>
                    </button>
                    <button class="btn btn-icon download-btn">
                        <i class="icon ti ti-download"></i>
                    </button>
                </div>
            </div>
        </div>`)
                if (!model["imgurl"]) {
                    // dom.find(".detail").addClass("no-image");
                    dom.find(".img").remove();
                    dom.find(".img-no-image").addClass("shown");
                } else {
                    if(platform=="Github Pages")dom.find(".img").attr("data-gisrc", "https://raw.githubusercontent.com/MicroCBer/ModelViewer/main/"+model["imgurl"])
                    else 
                    dom.find(".img").attr("src", model["imgurl"])
                     
                }

                dom.find(".name").text(decodeUnicode(model["name"]))
                dom.find(".author").text(decodeUnicode(model["author"]))
                dom.find(".id").text(model["uploadtime"])
                $("#sabers").append(dom[0])
                $($("#sabers")[0].lastChild).find(".more-information-btn").click(() => {
                    $.ui.dialog({
                        title: model["name"],
                        message: md(model["description"]),
                    })
                })
                $($("#sabers")[0].lastChild).find(".download-btn").click(() => {
                    document.location.assign(model["modelurl"])
                })
            }
            if(platform=="Github Pages")
            $("img[data-gisrc]").gazeimg({bg:['#000']})
        }

        let loadLock = false;
        if(handle)removeEventListener("scroll",handle);
        handle=addEventListener("scroll", () => {
            if (window.scrollY > document.body.scrollHeight - 1500 && !loadLock) {
                loadLock = true
                maxIndex = Math.min(sabers.length, maxIndex + 10);
                loadModels()
                setTimeout(() => loadLock = false, 100);
            }
        })
        loadModels()
    }
    initModels()

    $("#gqui-imageonly").on("change",function(){
        if(this.checked)filters["imageonly"]=(model)=>model["imgurl"]?true:false;
        else delete filters["imageonly"]
        initModels()
    })

    $("#gqui-timesort").on("change",function(){
        filteredHandle=()=>{sabers.sort((a,b)=>{
            return a["uploadtime"]-b["uploadtime"]
        })}
        initModels()
    })
    $("#gqui-timesort-reversed").on("change",function(){
        filteredHandle=()=>{sabers.sort((a,b)=>{
            return b["uploadtime"]-a["uploadtime"]
        })}
        initModels()
    })
    $("#gqui-unsort").on("click",function(){
        filteredHandle=()=>{sabers.sort((a,b)=>{
            return Math.random()-0.5
        })}
        initModels()
    })
    $("#gqui-search").on("change",function(){

        if(this.checked){
            search.disabled=true;
            filters["search"]=(model)=>{
                return model["description"].includes(search.value)
            };
        }
        else{
            delete filters["search"]
            search.disabled=false
        } 
        initModels()
    })

    $(".btnSubtitle").click(async function(){
        if($(this).hasClass("activated"))return;
        $(".btnSubtitle").removeClass("activated");
        $(this).addClass("activated");
        sabersData = (await (await fetch(this.dataset.file)).json())["model"]
        $("#sabers").fadeOut(200)
        setTimeout(()=>{
            initModels()
            $("#sabers").fadeIn(200)
        },200)
        
        
    })
})()