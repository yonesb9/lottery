(function(){
    var choosed = JSON.parse(localStorage.getItem('choosed')) || {};
    console.log(choosed);
    var speed = function(){
        return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
    };
    var getKey = function(item){
        return item.name + '-' + item.id;
    };
    var createHTML = function(){
        var html = [ '<ul>' ];
        member.forEach(function(item, index){
            item.index = index;
            var key = getKey(item);
            var color = choosed[key] ? 'white' : 'white';
            html.push('<li><a href="#" style="color: ' + color + ';">' + item.name + '</a></li>');
        });
        html.push('</ul>');
        return html.join('');
    };
    var lottery = function(count){
        var list = canvas.getElementsByTagName('a');
        var color = 'white';
        var ret = member
            .filter(function(m, index){
                m.index = index;
                return !choosed[getKey(m)];
            })
            .map(function(m){
                return Object.assign({
                  score: Math.random()
                }, m);
            })
            .sort(function(a, b){
                return a.score - b.score;
            })
            .slice(0, count)
            .map(function(m){
              choosed[getKey(m)] = 1;
              list[m.index].style.color = color;
              return m.name + '<br/>' + m.id; 
            });
        localStorage.setItem('choosed', JSON.stringify(choosed));
        return ret;
    };
    var canvas = document.createElement('canvas');
    canvas.id = 'myCanvas';
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    document.getElementById('main').appendChild(canvas);
    new Vue({
        el: '#tools',
        data: {
            selected: 30,
            running: false,
            btns: [
                 5, 2, 1
            ]
        },
        mounted () {
            canvas.innerHTML = createHTML();
            TagCanvas.Start('myCanvas', '', {
                textColour: null,
                initial: speed(),
                dragControl: 1,
                textHeight: 14
            });
        },
        methods: {
            reset: function(){
                if(confirm('آیا مطمئن هستید که می خواهید تمام اطلاعات قرعه کشی قبلی پاک کنی؟!')){
                    localStorage.clear();
                    location.reload(true);
                }
            },
            onClick: function(num){
                $('#result').css('display', 'none');
                $('#main').removeClass('mask');
                this.selected = num;
            },
            toggle: function(){
                if(this.running){
                    TagCanvas.SetSpeed('myCanvas', speed());
                    var ret = lottery(this.selected);
                    if (ret.length === 0) {
                        $('#result').css('display', 'block').html('<span>داداچ اشتباه زدی! برنده ای نداشتیم</span>');
                        return
                    }
                    $('#result').css('display', 'block').html('<span>' + ret.join('</span><span>') + '</span>');
                    TagCanvas.Reload('myCanvas');
                    setTimeout(function(){
                        localStorage.setItem(new Date().toString(), JSON.stringify(ret));
                        $('#main').addClass('mask');
                    }, 300);
                } else {
                    $('#result').css('display', 'none');
                    $('#main').removeClass('mask');
                    TagCanvas.SetSpeed('myCanvas', [5, 1]);
                }
                this.running = !this.running;
            }
        }
    });
})();