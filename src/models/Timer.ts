 export default class Timer {
    timerId: any;
    start: any;
    remaining: any;
    delay: number;
    callback: () => void;

     constructor(callback: () => void, delay: number) {
         this.callback = callback;
         this.delay = delay;
         this.timerId = delay;
         this.start = delay;
         this.remaining = delay;
     }
     
     public pause() {
        window.clearTimeout(this.timerId);
        this.remaining -= Date.now() - this.start;
     }
     public resume() {
        this.start = Date.now();
        window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout(this.callback, this.remaining);
     }
 } 