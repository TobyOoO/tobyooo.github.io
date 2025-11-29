
export namespace GameFlow {
    export enum State {
        Onboarding = 'Onboarding',
        InRoom = 'InRoom',
        Interaction = 'Interaction',
        Lesson = 'Lesson',
        StoryTelling = 'StoryTelling',
        StateUpdate = 'StateUpdate',
        EndingTelling = 'EndingTelling'
    }
}

type StateChangeListener = (newState: GameFlow.State) => void;

class StateManager {
    private _currentState: GameFlow.State = GameFlow.State.Onboarding;
    private listeners: Set<StateChangeListener> = new Set();

    public get state(): GameFlow.State {
        return this._currentState;
    }

    public setState(newState: GameFlow.State) {
        if (this._currentState !== newState) {
            console.log(`[StateManager] State changed: ${this._currentState} -> ${newState}`);
            this._currentState = newState;
            this.notifyListeners();
        }
    }

    public is(state: GameFlow.State): boolean {
        return this._currentState === state;
    }

    public subscribe(listener: StateChangeListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this._currentState));
    }
}

export const stateManager = new StateManager();
export default stateManager;
