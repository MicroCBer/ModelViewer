!(async () => {

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

    let sabersData = (await (await fetch("qsabers-all.json")).json())["模型"],
        sabers=[],filters={},filteredHandle=()=>{};
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
                if (model["图片链接"] == undefined)
                    console.log(model, model["图片链接"])
                if (!model["图片链接"]) {
                    // dom.find(".detail").addClass("no-image");
                    dom.find(".img").remove();
                    dom.find(".img-no-image").addClass("shown");
                } else {
                    dom.find(".img").attr("data-gisrc", model["图片链接"])
                    dom.find(".img").gazeimg()
                }

                dom.find(".name").text(decodeUnicode(model["名称"]))
                dom.find(".author").text(decodeUnicode(model["作者"]))
                dom.find(".id").text(model["ID"])
                $("#sabers").append(dom[0])
                $($("#sabers")[0].lastChild).find(".more-information-btn").click(() => {
                    $.ui.dialog({
                        title: model["名称"],
                        message: md(model["介绍"]),
                    })
                })
                $($("#sabers")[0].lastChild).find(".download-btn").click(() => {
                    document.location.assign(model["模型链接"])
                })
            }
        }

        let loadLock = false;
        if(handle)removeEventListener("scroll",handle);
        handle=addEventListener("scroll", () => {
            if (window.scrollY > document.body.scrollHeight - 1000 && !loadLock) {
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
        if(this.checked)filters["imageonly"]=(model)=>model["图片链接"]?true:false;
        else delete filters["imageonly"]
        initModels()
    })

    $("#gqui-timesort").on("change",function(){
        filteredHandle=()=>{sabers.sort((a,b)=>{
            return a["发布时间"]-b["发布时间"]
        })}
        initModels()
    })
    $("#gqui-timesort-reversed").on("change",function(){
        filteredHandle=()=>{sabers.sort((a,b)=>{
            return b["发布时间"]-a["发布时间"]
        })}
        initModels()
    })
    $("#gqui-unsort").on("click",function(){
        filteredHandle=()=>{sabers.sort((a,b)=>{
            return Math.random()-0.5
        })}
        initModels()
    }) 
})()
