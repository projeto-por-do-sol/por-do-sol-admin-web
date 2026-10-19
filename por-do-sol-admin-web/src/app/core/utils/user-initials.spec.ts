import { UserInitials } from './user-initials';

describe('UserInitials', () => {
  it('should use the first and last relevant initials', () => {
    expect(UserInitials.getNameInitials('José da Silva')).toBe('JS');
  });

  it('should fall back to "!" without a name', () => {
    expect(UserInitials.getNameInitials(null)).toBe('!');
  });
});
