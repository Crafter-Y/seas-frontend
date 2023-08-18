SEAS - Selbsteinteilungs- & Administrationssoftware (Ehml. CSA-Frontend Church Staff Allocator)

## Ressources

- [Logout SVG](https://www.svgrepo.com/svg/115080/logout)
- [Settings SVG](https://www.svgrepo.com/svg/11478/settings)
- [Pen And Paper SVG](https://www.svgrepo.com/svg/41783/pen-and-paper)
- [Menu SVG](https://www.svgrepo.com/svg/3034/menu)
- [Previous SVG](https://www.svgrepo.com/svg/79187/left-arrow)
- [Close SVG](https://www.svgrepo.com/svg/30681/close)
- [Refresh SVG](https://www.svgrepo.com/svg/76889/refresh)
- [Edit SVG](https://www.svgrepo.com/svg/56967/edit)
- [Check SVG](https://www.svgrepo.com/svg/125862/check)
- [Print SVG](https://www.svgrepo.com/svg/476458/print)
- [Calendar SVG](https://www.svgrepo.com/svg/511575/calendar-1322)

# Next tasks

- [ ] Board implementation

  - [ ] Print export (5h)
  - [ ] Calendar export (5h)

  - [x] display selected board columns
  - [x] assign field for cols where nobody is assigned (30min + api)

  - [ ] modal for event when touch
    - [x] self-assign to fields (30min)
    - [x] validation to only assign once (1h)
    - [x] admin force assign (2h)
    - [x] admin single delete (1h)
    - [ ] comment field implementation (3h)
    - [x] make it responsive to changes without need to close
    - [x] delete event

- [x] always ask before erasing any data
- [x] Remove unused styling classes
- [x] refactor all delete operations to await Api response before refresh
- [x] reactivate user functionality (users get disabled, but email is still existing in DB)
- [ ] prevent spamming buttons in settings
- [x] make login authentication less buggy
- [x] introduce global store to don't query information twice
- [x] make picker element iOS friendly
- [x] splash screen
- [x] app icon/name
- [ ] settings first section web header glitch fix
- [ ] (auto-update)
