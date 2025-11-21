---
title: "The perfect tiling window manager"
date:   2025-09-14 12:00:00
tags: ["niri", "nixos", "wm", "windowmanager", "wayland"]
github_comments_issueid: "34"
---

[XMonad](../xmonad-polybar-nixos) has been my main driver for years, and I still think it's the best X11 window manager ever. However, the X11 windowing system is quite dated, having originated about 40 years ago. Its number of limitations, among other things, has led to the creation of the Wayland protocol.

This is a modern protocol that allows compositors to operate in a more efficient and lightweight manner. Since its inception in 2008, it has gained popularity to the point where prominent display managers such as GNOME and KDE have adopted it --- [Mutter](https://mutter.gnome.org/) and [KWin](https://invent.kde.org/plasma/kwin), respectively.

When it comes to modern tiling window managers, [Sway](https://swaywm.org/) has led the way by implementing the Wayland protocol, while taking inspiration from [i3](https://i3wm.org/) for X11.

Personally, it wasn't until [Hyprland](https://hypr.land/) came around that I felt adventurous enough to consider Wayland a serious time investment. While I didn't specifically write about it in this blog, you can see it mentioned in a [recent blogpost](../home-manager-dotfiles-management). I had a good ride with it, but ultimately, I wasn't entirely satisfied with the overall experience.

So it was only a matter of time until the inevitable happened... I had a very interesting project on my radar for a while, and finally the universes aligned to allow me the time to give it a try --- and holy cows, there's no way back.

## A new tiling Wayland compositor

![logo](../../images/niri/niri-logo.svg)

[Niri](https://github.com/YaLTeR/niri) is written in Rust, and it is simply described as a "scrollable-tiling Wayland compositor" which is heavily inspired by [PaperWM](httpspaperwm/PaperWM). By default, windows are spawned next to each other on an infinite horizontal space! 🤯 

While it may not sound very appealing, I can tell you from experience that it's liberating. It would be counter-productive, however, if we limited ourselves to a single scrollable horizontal tile. The good news is that Niri also supports workspaces, and multiple monitors are first-class citizens.

![workspace](../../images/niri/workspace.png)

Moreover, [screencasting](https://yalter.github.io/niri/Screencasting.html) is supported via [xdg-desktop-portal-gnome](https://gitlab.gnome.org/GNOME/xdg-desktop-portal-gnome), which makes sense, given the author is a GNOME contributor.

And there are a lot of other features such as layers, tabs, gestures, and the ever important [XWayland](https://yalter.github.io/niri/Xwayland.html) support via [xwayland-satellite](https://github.com/Supreeeme/xwayland-satellite).

### Scratchpads

Scratchpads are a crucial feature of any tiling window manager for my workflows. I mainly use it for Spotify and a File Manager, but it's good to know we have the option of starting any application as a scratchpad.

Unfortunately, this is not a native Niri feature. However, it recently gained support for [floating windows](https://yalter.github.io/niri/Floating-Windows.html), which combined with [IPC socket communication](https://yalter.github.io/niri/IPC.html) with the running Niri instance, gives us what we need to build scratchpad support.

And that's exactly what I've done: [gvolpe/niri-scratchpad](https://github.com/gvolpe/niri-scratchpad). All we need is a rather simple script, so users are encouraged to play around with it and customize it.

## Showcase

Writing more about it would be boring. Let me show you what it feels like to use it!

{{< vid "../../images/niri/showcase.mp4" >}}

It is also possible to view it on [YouTube](https://youtu.be/Mo4nO6mI9DU) if that's preferred.

These are only some of the features that Niri offers, but there's so much more I didn't cover in this video such as resizing windows, moving windows between workspaces, etc. The overview is perhaps my favorite of them all!

You can also check out [this excellent review video](https://www.youtube.com/watch?v=DeYx2exm04M) by Brodie Robertson.

## Closing remarks

It's only been two weeks using Niri and I'm extremely happy with it. It feels fast, snappy and beautiful. I love it when a tiling window manager is lightweight and efficient, enabling the user to become one with it --- increasing productivity.

That's all I have. If you like the project, go give it a star. You can also sponsor its main developer [Ivan Molodetskikh](https://github.com/sponsors/YaLTeR), he would definitely appreciate it.

Best,
Gabriel.
