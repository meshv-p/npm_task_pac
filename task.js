#!/usr/bin/env node
/**
 * @author Meshv patel
 */
import * as fs from "fs";
const args = process.argv;
// usage represents the help guide
const usage = function () {
  const usageText = `   Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text \"hello world\" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;
  console.log(usageText);
};

//   List all function for our task
function addTask() {
  var data = `${args[3]} ${args[4]}\n`;
  fs.appendFile("task.txt", data, (err) => {
    if (err) console.log(err);
    if (args[4] == undefined) {
      console.log("Error: Missing tasks string. Nothing added!");
    } else {
      console.log(`Added task: "${args[4]}" with priority ${args[3]}`);
    }
  });
}

function lsTask() {
  try {
    var text = fs.readFileSync("task.txt").toString("utf-8");
    let textByLine = text.split("\n");
    textByLine.sort((a, b) => {
      var ax = [],
        bx = [];
      a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        ax.push([$1 || Infinity, $2 || ""]);
      });
      b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        bx.push([$1 || Infinity, $2 || ""]);
      });
      while (ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = an[0] - bn[0] || an[1].localeCompare(bn[1]);
        if (nn) return nn;
      }
      return ax.length - bx.length;
    });

    if (textByLine.length == 1) console.log("There are no pending tasks!");

    for (let index = 1; index < textByLine.length; index++) {
      let last_index_of_number = 1;
      if (index == textByLine.length) {
        break;
      }
      if (textByLine[index].charAt(1) == " ") {
        last_index_of_number = 1;
      } else if (textByLine[index].charAt(2) == " ") {
        last_index_of_number = 2;
      } else {
        last_index_of_number = 3;
      }
      console.log(
        index + ".",
        textByLine[index].substring(last_index_of_number + 1) +
          ` [${textByLine[index].substring(0, last_index_of_number)}]`
      );
    }
  } catch (error) {
    console.log("There are no pending tasks!");
  }
}

function doneTask() {
  var text = fs.readFileSync("task.txt").toString("utf-8");
  let textByLine = text.split("\n");
  if (args[3] == undefined) {
    console.log("Error: Missing NUMBER for marking tasks as done.");
  } else {
    if (!textByLine[args[3] - 1]) {
      console.log(`Error: no incomplete item with index #${args[3]} exists.`);
    } else {
      let last_index_of_number = 1;
      if (textByLine[args[3] - 1].charAt(1) == " ") {
        last_index_of_number = 1;
      } else if (textByLine[args[3] - 1].charAt(2) == " ") {
        last_index_of_number = 2;
      } else {
        last_index_of_number = 3;
      }
      let data = "";
      data = textByLine[args[3] - 1].substring(last_index_of_number + 1) + "\n";
      fs.appendFile("completed.txt", data, (err) => {
        if (err) console.log(err);
      });
      fs.readFile("task.txt", "utf8", function (err, data) {
        var linesExceptFirst = data
          .split("\n")
          .filter((val, idx) => [args[3] - 1].indexOf(idx) === -1)
          .join("\n");
        fs.writeFileSync("task.txt", linesExceptFirst);
      });
      console.log("Marked item as done.");
    }
  }
}

function delTask() {
  try {
    if (args[3] == undefined) {
      console.log("Error: Missing NUMBER for deleting tasks.");
    } else {
      fs.readFile("task.txt", "utf8", function (err, data) {
        if (!data.toString("utf-8").split("\n")[args[3] - 1]) {
          console.log(
            `Error: task with index #${args[3]} does not exist. Nothing deleted.`
          );
          return;
        } else {
          var linesExceptFirst = data
            .split("\n")
            .filter((val, idx) => [args[3] - 1].indexOf(idx) === -1)
            .join("\n");
          fs.writeFileSync("task.txt", linesExceptFirst);
          console.log(`Deleted task #${args[3]}`);
        }
      });
    }
  } catch (error) {
    console.log("Sorry task not deleted");
  }
}

function report() {
  var Pending = fs.readFileSync("task.txt").toString("utf-8").split("\n");
  var Completed = fs
    .readFileSync("completed.txt")
    .toString("utf-8")
    .split("\n");
  console.log(`Pending : ${Pending.length - 1}`);
  lsTask();
  console.log(`\nCompleted : ${Completed.length - 1}`);
  Completed.map((line, index) => {
    if (index + 1 == Completed.length) {
      return;
    } else {
      console.log(index + 1 + ".", line);
    }
  });
}

switch (args[2]) {
  case "help":
    usage();
    break;
  case "add":
    addTask();
    break;
  case "ls":
    lsTask();
    break;
  case "done":
    doneTask();
    break;
  case "del":
    delTask();
    break;
  case "report":
    report();
    break;
  default:
    usage();
}
