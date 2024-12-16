let arr = [];
let currentSortType = 'bubble';
let isAnimating = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let animationSpeed = 100;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const sortButtons = document.querySelectorAll('.controls button:not(.init):not(.play)');
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            currentSortType = button.id;
        });
    });

 document.getElementById('arraySize').addEventListener('input',(e)=>{
    document.getElementById('arraySizeValue').textContent=e.target.value
    init()
 })
 

    document.getElementById('speed').addEventListener('input', (e) => {
        animationSpeed = 201 - e.target.value; // Invert the speed so higher value = faster
        document.getElementById('speedValue').textContent = `${animationSpeed}ms`;
    });

    init();
});

// Initialize array
function init(){
    if(isAnimating) return
    const size = parseInt (document.getElementById('arraySize').value) 
     arr = Array(size).fill.map(()=>Math.random())
     resetStats()
     showBars()
}

// Reset statistics
function resetStats() {
    comparisons = 0;
    swaps = 0;
    startTime = 0;
    updateStats();
}

// Update statistics display
function updateStats() {
    document.getElementById('comparisons').textContent = `Comparisons: ${comparisons}`;
    document.getElementById('swaps').textContent = `Swaps: ${swaps}`;
    if (startTime > 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        document.getElementById('time').textContent = `Time: ${elapsed}s`;
    } else {
        document.getElementById('time').textContent = 'Time: 0.0s';
    }
}

// Play animation
function play() {
    if (isAnimating) return;
    resetStats();
    startTime = Date.now();
    const copy = [...arr];
    const moves = getSortMoves(copy);
    isAnimating = true;
    animate(moves);
}

function getSortMoves(arr) {
    switch (currentSortType) {
        case 'bubbleSort': return bubbleSort(arr);
        case 'insertionSort': return insertionSort(arr);
        case 'selectionSort': return selectionSort(arr);
        default: return bubbleSort(arr);
    }
}

// Animation function
function animate(moves) {
    if (moves.length == 0) {
        showBars();
        isAnimating = false;
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;
    
    if (move.type === "comp") {
        comparisons++;
    } else if (move.type === "swap") {
        swaps++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    updateStats();
    showBars(move);
    setTimeout(() => animate(moves), animationSpeed);
}

// Bubble Sort algorithm
function bubbleSort(arr) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 1; i < arr.length; i++) {
            moves.push({indices: [i-1, i], type: "comp"});
            if (arr[i-1] > arr[i]) {
                swapped = true;
                moves.push({indices: [i-1, i], type: "swap"});
                [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
            }
        }
    } while(swapped);
    return moves;
}

// Insertion Sort algorithm
function insertionSort(arr) {
    const moves = [];
    for (let i = 1; i < arr.length; i++) {
        let j = i;
        while (j > 0) {
            moves.push({indices: [j-1, j], type: "comp"});
            if (arr[j-1] > arr[j]) {
                moves.push({indices: [j-1, j], type: "swap"});
                [arr[j-1], arr[j]] = [arr[j], arr[j-1]];
                j--;
            } else {
                break;
            }
        }
    }
    return moves;
}

// Selection Sort algorithm
function selectionSort(arr) {
    const moves = [];
    for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            moves.push({indices: [minIdx, j], type: "comp"});
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            moves.push({indices: [i, minIdx], type: "swap"});
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
    return moves;
}

// Display bars
function showBars(move) {
    container.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = arr[i] * 100 + "%";
        bar.classList.add("bar");
        if (move && move.indices.includes(i)) {
            bar.classList.add(move.type === "swap" ? "swapping" : "comparing");
        }
        container.appendChild(bar);
    }
}