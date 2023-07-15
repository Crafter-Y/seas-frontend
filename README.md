## Ressources

- [Logout SVG](https://www.svgrepo.com/svg/115080/logout)
- [Settings SVG](https://www.svgrepo.com/svg/11478/settings)
- [Pen And Paper SVG](https://www.svgrepo.com/svg/41783/pen-and-paper)
- [Menu SVG](https://www.svgrepo.com/svg/3034/menu)
- [Next SVG](https://www.svgrepo.com/svg/3667/next)
- [Previous SVG](https://www.svgrepo.com/svg/79187/left-arrow)
- [Alert SVG](https://www.svgrepo.com/svg/204957/alert)
- [Close SVG](https://www.svgrepo.com/svg/30681/close)
- [Refresh SVG](https://www.svgrepo.com/svg/76889/refresh)
- [Edit SVG](https://www.svgrepo.com/svg/56967/edit)
- [Check SVG](https://www.svgrepo.com/svg/125862/check)
- [Print SVG](https://www.svgrepo.com/svg/476458/print)
- [Calendar SVG](https://www.svgrepo.com/svg/511575/calendar-1322)

# Settings implementation Roadmap

- [x] Admin/Settings Layout

  - [x] corpus
  - [x] mobile navigation page
  - [x] navigation functionality

- [x] Manage Users

  - [x] Create User API
  - [x] get All Users API
  - [x] delete User API
  - [x] request new user Password API
  - [x] design & functionality

- [x] Manage Positions

  - [x] get All Columns API
  - [x] create Column API
  - [x] delete Column API
  - [x] rename column API
  - [x] assign column API
  - [x] Inline Editing functionality
  - [x] design & functionality

- [x] Recurring Events

  - [x] Create reurring event API
  - [x] get All recurring events API (ask for effected columns, delete)
  - [x] delete event API
  - [x] Quick event creation
  - [x] Manual event creation
  - [x] create a recurring event
  - [x] delete event, but ask before

- [x] Comment templates

  - [x] Create comment template API
  - [x] Get all comment templates API
  - [x] delete comment template API
  - [x] design & functionality

- [x] Manage Pages

  - [x] create page API
  - [x] get all pages API
  - [x] delete page API
  - [x] rename page API
  - [x] Inline Editing functionality
  - [x] design & functionality

- [ ] always ask before erasing any data
- [ ] Remove unused styling classes
- [ ] refactor all delete operations to await Api response before refresh
- [ ] reactivate user functionality (users get disabled, but email is still existing in DB)
