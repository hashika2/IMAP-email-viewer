interface Window {
  google: {
    accounts: {
      oauth2: {
        initCodeClient: (config: {
          client_id: string;
          scope: string;
          ux_mode: string;
          callback: (resp: any) => void;
        }) => any; // More specific type can be added if known
      };
    };
  };
}
