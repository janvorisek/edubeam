export interface ICommand<T> {
  execute: (value: T) => void;
  undo: (value: T) => void;
  value: T;
}

export class Command<T> implements ICommand<T> {
  constructor(
    public execute: (value: T) => void,
    public undo: (value: T) => void,
    public value: T
  ) {}
}

export class Command2<T> implements ICommand<T> {
  constructor(
    public execute: (value: T) => void,
    public undo: (value: T) => void,
    public value: T
  ) {}
}

export class CommandManager<T> {
  private history: Array<Command<T>> = [];
  private redoStack: Array<Command<T>> = [];

  executeCommand(command: Command<T>): void {
    command.execute(command.value);
    this.history.push(command);
    this.redoStack = []; // clear redo stack after new command
  }

  undo(): void {
    if (!this.history.length) return console.info("No commands in history to undo.");
    const command = this.history.pop() as Command<T>;
    command.undo(command.value);
    this.redoStack.push(command);
  }

  redo(): void {
    if (!this.redoStack.length) return console.info("No commands in redo stack to redo.");
    const command = this.redoStack.pop() as Command<T>;
    command.execute(command.value);
    this.history.push(command);
  }

  clearHistory(): void {
    this.history = [];
    this.redoStack = [];
  }
}

export interface IKeyValue {
  [key: string]: unknown;
}

export const undoRedoManager = new CommandManager<IKeyValue>();
