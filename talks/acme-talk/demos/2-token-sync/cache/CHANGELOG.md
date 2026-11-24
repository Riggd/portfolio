## 0.2.0

### Added
- `color.feedback.info.fg`, `color.feedback.info.bg` and `color.feedback.info.border` for informational status UI.

### Changed
- Renamed the `color.danger` group to `color.feedback.error` (`fg`, `bg`, `border`). Values are unchanged.
- `space.3` changed from 12 to 14. 14 is not on the spacing scale (4/8/12/16/24/32/48).

### Migration

#### Rename `color.danger` to `color.feedback.error`
Before: `color.danger.fg`, `color.danger.bg`, `color.danger.border`
After: `color.feedback.error.fg`, `color.feedback.error.bg`, `color.feedback.error.border`

Affected: `tokens/component.json` (1 reference each to fg, bg and border). Update these references or the build breaks.

#### `space.3` changed from 12 to 14
Before: `space.3` = 12
After: `space.3` = 14

Affected: `acme.rules.json` (1), `src/foundations.css` (1), `tokens/component.json` (2). 14 is off the spacing scale (4/8/12/16/24/32/48). Confirm it is intended. If it is, update the scale in `acme.rules.json`. If not, revert to 12.

