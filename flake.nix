{
  description = "Dev environment with esbuild";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05"; # or your preferred version
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.esbuild
            pkgs.nodejs_20 # or another version if needed
          ];

          shellHook = ''
            echo "Welcome to the esbuild development shell!"
          '';
        };
      }
    );
}
