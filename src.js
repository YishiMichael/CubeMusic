var noteElements = [];
let sound;
for (let i = 0; i < 16; ++i) {
    sound = new Howl({
        src: `notes/${i}.mp3`,
    });
    noteElements.push(sound);
}


var vm = new Vue({
    el: "#grid",

    data: function() {
        return {
            beat: 0,
            cellStates: new Array(256).fill(0),
            mouseState: -1, // 1: active; 0: deactive
            mouseOnCellIndex: -1,
        }
    },

    mounted: function() {
        //let noteElement;
        //for (let i = 0; i < 16; ++i) {
        //    noteElement = document.createElement("audio");
        //    noteElement.setAttribute("id", `note${i}`);
        //    noteElement.setAttribute("src", `notes/${i}.wav`);
        //    document.head.appendChild(noteElement);
        //}
        setInterval(() => {
            this.beat = Math.floor((this.beat + 1) % 16);
        }, 125);
    },

    watch: {
        beat: function() {
            let activeIndices = [];
            this.cellStates.slice(this.beat * 16, (this.beat + 1) * 16).forEach(function(isActive, index) {
                if (isActive) {
                    activeIndices.push(index)
                }
            });
            let cellElement;
            for (let i of activeIndices) {
                noteElements[15 - i].play();
                cellElement = document.querySelector(`#id${this.beat * 16 + i}`);
                if (!cellElement.classList.contains("shining")) {
                    cellElement.classList.add("shining");
                }
            }
        }
    },

    methods: {
        mouseDown: function() {
            if (this.mouseOnCellIndex === -1) {
                return;
            }
            this.mouseState = this.cellStates[this.mouseOnCellIndex] ? 0 : 1;
            this.$set(this.cellStates, this.mouseOnCellIndex, this.mouseState);
        },

        mouseUp: function() {
            this.mouseState = -1;
        },

        cellMouseEnter: function(index) {
            this.mouseOnCellIndex = index;
            if (this.mouseState === -1) {
                return;
            }
            this.$set(this.cellStates, index, this.mouseState);
        },

        cellMouseLeave: function(index) {
            this.mouseOnCellIndex = -1;
        },
    },

})
