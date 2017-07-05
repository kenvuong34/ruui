const backArrow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAeElEQVR4Ae2UJxJCQRBEW3FCFAoUDkXcQD7OvyHhkcZhu1btqxo5eab1T6dTGCsz6MhIdioTJe5KoMJMVhJTZR4R/Ooey1yJ5zd4pshKZqEEYSs5+QaM4N9EVjIlgj+/IwqaJ2g/Iv+S25+p4dEyFwXtpcIudp3OC08lc/MlMM5BAAAAAElFTkSuQmCC';
const downArrow = 'data:image/png;base64,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';

export const base64Icons = {
	backArrow,
	downArrow,
};