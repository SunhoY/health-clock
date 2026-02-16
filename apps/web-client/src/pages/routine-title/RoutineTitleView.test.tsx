import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoutineTitleView } from './RoutineTitleView';
import { RoutineTitleForm } from '../../types/exercise';

const emptyForm: RoutineTitleForm = {
  title: '',
  isValid: false,
  error: undefined
};

const validForm: RoutineTitleForm = {
  title: '테스트 루틴',
  isValid: true,
  error: undefined
};

const mockOnTitleChange = jest.fn();
const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();

describe('RoutineTitleView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('다이얼로그가 올바르게 렌더링된다', () => {
    render(
      <RoutineTitleView
        form={emptyForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('루틴 제목 입력')).toBeInTheDocument();
    expect(screen.queryByText('저장할 루틴의 제목을 입력해주세요')).not.toBeInTheDocument();
    expect(screen.getByLabelText('루틴 제목')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeInTheDocument();
  });

  it('입력값이 비어 있으면 placeholder만 보인다', () => {
    render(
      <RoutineTitleView
        form={emptyForm}
        titlePlaceholder="복합 루틴 (2월 16일)"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByLabelText('루틴 제목') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('복합 루틴 (2월 16일)');
  });

  it('제목 변경 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={emptyForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByLabelText('루틴 제목'), '새 루틴');

    expect(mockOnTitleChange).toHaveBeenCalled();
  });

  it('유효하지 않은 입력 시 에러 메시지가 표시된다', () => {
    const formWithError: RoutineTitleForm = {
      title: '',
      isValid: false,
      error: '제목을 입력해주세요'
    };

    render(
      <RoutineTitleView
        form={formWithError}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('제목을 입력해주세요')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeDisabled();
  });

  it('Enter 키를 누르면 저장이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={validForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByLabelText('루틴 제목'), '{Enter}');

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('ESC 키를 누르면 취소가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={validForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByLabelText('루틴 제목'), '{Escape}');

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('저장 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={validForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await user.click(screen.getByText('저장'));

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('취소 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={validForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await user.click(screen.getByText('취소'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('폼이 유효하지 않을 때 Enter 키로 저장이 호출되지 않는다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={emptyForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByLabelText('루틴 제목'), '{Enter}');

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('다이얼로그 외부 클릭 시 취소가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={validForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await user.click(screen.getByRole('dialog'));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('접근성 속성이 올바르게 설정된다', () => {
    render(
      <RoutineTitleView
        form={validForm}
        titlePlaceholder="추천 루틴"
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'routine-title-modal-title');

    expect(screen.getByLabelText('루틴 제목')).toBeInTheDocument();
  });
});
