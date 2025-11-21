{
  description = "Hugo site tools flake";

  inputs = {
    nixpkgs.url = github:nixos/nixpkgs/nixpkgs-unstable;
  };

  outputs = { nixpkgs, ... }:
    let
      system = "x86_64-linux";

      pkgs = import nixpkgs {
        inherit system;
        overlays = [ ];
        config = {
          allowUnfree = true;
          contentAddressedByDefault = false;
        };
      };
    in
    {
      devShell.${system} = pkgs.mkShell {
        name = "site-tools-shell";
        buildInputs = with pkgs;[
          hugo
        ];
        shellHook = ''        '';
      };
    };
}
