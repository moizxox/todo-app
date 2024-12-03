let addTaskBtn = document.getElementById("addBtn");
let taskList = document.querySelector(".task-list");
let form = document.querySelector("#inputForm");
let newTaskTitle;
let taskKey;
let searchForm = document.querySelector("#searchForm #searchTask");
let searchString = "";
let isSearching = false;

searchForm.addEventListener("input", (e) => {
  e.preventDefault();
  searchString = searchForm.value;
  if (searchString !== "") {
    isSearching = true;
  }
  taskList.innerHTML = "";
  if (isSearching) {
    searchData(searchString);
  } else {
    addBoxes();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let taskInput = document.querySelector("#addTaskInput").value;
  let taskStatus = false;
  if (taskInput !== "") {
    let taskInputData = {
      inputTaskTitle: taskInput,
      inputTaskStatus: taskStatus,
    };
    localStorage.setItem(Date.now(), JSON.stringify(taskInputData));
    taskList.innerHTML = "";
    addBoxes();
    form.reset();
  } else {
    let emptyMsg = document.querySelector(".empty-msg");
    emptyMsg.classList.remove("hidden");
    setTimeout(() => {
      emptyMsg.classList.add("hidden");
    }, 1000);
  }
  taskList.innerHTML = "";
  if (isSearching) {
    searchData(searchString);
  } else {
    addBoxes();
  }
});

let addBoxes = () => {
  for (let i = 0; i < localStorage.length; i++) {
    newTaskTitle = localStorage.getItem(localStorage.key(i));
    taskKey = localStorage.key(i);
    // console.log(taskKey, JSON.parse(newTaskTitle).inputTaskTitle);

    addTask(
      JSON.parse(newTaskTitle).inputTaskTitle,
      taskKey,
      JSON.parse(newTaskTitle).inputTaskStatus
    );
  }

  editTask();
  deleteTask();
  checkTask();
};

let addTask = (taskTitle, key, status) => {
  const btnText = status === "true" ? "Not Complete" : "Complete";
  const taskBox = `<div
  class="task-box p-[10px] bg-white rounded-[10px] flex flex-col gap-y-[10px]"
  data-key="${key}"
  data-status="${status}"
>
  <input
    id="taskTitle"
    type="text"
    value="${taskTitle}"
    class="w-full bg-transparent outline-none font-medium"
    disabled
  />
  <div class="task-btns">
    <button
      class="bg-blue-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 hover:bg-blue-600 text-white uppercase font-medium text-[12px] editBtn"
    >
      Edit
    </button>
    <button
      class="bg-red-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 hover:bg-red-600 text-white uppercase font-medium text-[12px] deleteBtn"
    >
      Delete
    </button>
    <button
      class="bg-green-400 py-[6px] px-[20px] rounded-[8px] transition duration-300 hover:bg-green-600 text-white uppercase font-medium text-[12px] completeBtn"
    >
      ${btnText}
    </button>
  </div>
  <div class="prior-sel">
    <select name="priority" id="prioritySelect" class="outline-none">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>
</div>
`;
  taskList.innerHTML += taskBox;
};

// Edit Task
let editTask = () => {
  let editBtns = document.querySelectorAll(".editBtn");
  let editAble = false;
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", () => {
      let taskBox = editBtn.closest(".task-box");
      let editTitle = taskBox.querySelector("#taskTitle");
      if (!editAble) {
        editTitle.disabled = false;
        editTitle.style.border = "solid 1px black";
        editBtn.innerText = "Save";
        editAble = true;
      } else {
        editTitle.disabled = true;
        editTitle.style.border = "none";
        editBtn.innerText = "Edit";
        editAble = false;

        let boxKey = taskBox.getAttribute("data-key");
        let taskData = JSON.parse(localStorage.getItem(boxKey));
        taskData.inputTaskTitle = editTitle.value;
        localStorage.setItem(boxKey, JSON.stringify(taskData));
      }
    });
  });
};

// Delete Tasks
let deleteTask = () => {
  let deleteBtns = document.querySelectorAll(".deleteBtn");
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", () => {
      let taskBox = deleteBtn.closest(".task-box");
      let taskTitle = taskBox.querySelector("#taskTitle");
      let boxKey = taskBox.getAttribute("data-key");
      localStorage.removeItem(boxKey);
      taskList.innerHTML = "";
      if (isSearching) {
        searchData(searchString);
      } else {
        addBoxes();
      }
    });
  });
};

// For Getting Searched Strings
let searchData = (string) => {
  const keys = Object.keys(localStorage);
  // console.log(keys);

  let allData = keys.map((key) => {
    let myData = JSON.parse(localStorage.getItem(key));
    let myTitle = myData.inputTaskTitle.toLowerCase();
    let myStatus = myData.inputTaskStatus;
    return {
      key: key,
      title: myTitle,
      staus: myStatus,
    };
  });
  // console.log(allData);

  let lowerSearchString = string.toLowerCase();
  let result = allData.filter((item) => item.title.includes(lowerSearchString));

  // console.log(result);

  for (let i = 0; i < result.length; i++) {
    let searchTaskKey = result[i].key;
    let searchTaskTitle = result[i].title;
    let searchTaskStatus = result[i].staus;
    // console.log(searchTaskKey, searchTaskTitle, searchTaskStatus);
    addTask(searchTaskTitle, searchTaskKey, searchTaskStatus);
  }
  editTask();
  deleteTask();
};
// Complete Task
let checkTask = () => {
  let completeBtns = document.querySelectorAll(".completeBtn");

  completeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      let taskBox = btn.closest(".task-box");
      let boxStatus = taskBox.getAttribute("data-status");
      let boxKey = taskBox.getAttribute("data-key");

      if (boxStatus === "false") {
        taskBox.setAttribute("data-status", "true");
        btn.innerText = "Not Complete";
        boxStatus = taskBox.getAttribute("data-status");
      } else {
        taskBox.setAttribute("data-status", "false");
        btn.innerText = "Complete";
        boxStatus = taskBox.getAttribute("data-status");
      }
      console.log(boxStatus);

      let taskData = JSON.parse(localStorage.getItem(boxKey));
      taskData.inputTaskStatus = boxStatus;
      localStorage.setItem(boxKey, JSON.stringify(taskData));
    });
  });
};

addBoxes();
