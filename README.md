# website

Personal website built using the [Big Picture template](https://html5up.net/big-picture), licensed under [CCA 3.0](./LICENSE.txt).

See it live at [gvolpe.com](https://gvolpe.com).

## gvolpe's blog: Principled Software Craftsmanship

It includes my personal blog, made with [Zetsu](https://github.com/nandomoreirame/zetsu).

A nix flake defines a shell providing the necessary tools to run the blog locally.

```console
$ nix flake show
git+file:///home/gvolpe/workspace/site
└───devShell
    ├───aarch64-darwin: development environment 'blog-tools-shell'
    ├───aarch64-linux: development environment 'blog-tools-shell'
    ├───i686-linux: development environment 'blog-tools-shell'
    ├───x86_64-darwin: development environment 'blog-tools-shell'
    └───x86_64-linux: development environment 'blog-tools-shell'
```

### Run it locally

```console
$ nix develop
$ bundle exec jekyll serve
# ....................
 Auto-regeneration: enabled for '/home/gvolpe/workspace/site'
Configuration file: /home/gvolpe/workspace/site/_config.yml
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```
