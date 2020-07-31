    function flashAnimateBackground(s) {
        let per = 0;
        let animate;
        let originalBackground = s.css('background');

        animate = setInterval(() => { 
            per++;
            if(per <= 100){
                dlog('percent='.concat(per));
                s.css({background: "linear-gradient(to right, #ffcc00 "+per+"%,transparent "+per+"%,transparent 100%)"});
            } else {
                clearInterval(animate);
                setTimeout(() => s.css('background', originalBackground), WAIT_MILISECONDS);
            } 
        }, 5);
    }