import { useState, useEffect } from 'react';
import { createMachine, CreateMachineConfig } from 'tiny-fsm';

export function useStateMachine(config: CreateMachineConfig) {
  const [initialConfig] = useState(config);
  const [state, setState] = useState(null);
  const [context, setContext] = useState(null);
  const [{ send, setActions, listen }] = useState(createMachine(initialConfig));
  useEffect(() => {
    listen.onContextChange(setContext);
    listen.onStateChange(setState);
    return () => {
      listen.onContextChange(() => {});
      listen.onStateChange(() => {});
    };
  }, [listen, setState, setContext]);
  return {
    state,
    context,
    send,
    setActions,
  };
}
