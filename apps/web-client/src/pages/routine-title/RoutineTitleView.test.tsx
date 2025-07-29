import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoutineTitleView } from './RoutineTitleView';
import { RoutineTitleForm } from '../../types/exercise';

const mockForm: RoutineTitleForm = {
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

  it('모달이 올바르게 렌더링된다', () => {
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('루틴 제목 입력')).toBeInTheDocument();
    expect(screen.getByText('저장할 루틴의 제목을 입력해주세요')).toBeInTheDocument();
    expect(screen.getByLabelText('루틴 제목')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeInTheDocument();
  });

  it('기본 제목이 입력 필드에 표시된다', () => {
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const input = screen.getByDisplayValue('테스트 루틴');
    expect(input).toBeInTheDocument();
  });

  it('제목 변경 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const input = screen.getByLabelText('루틴 제목');
    await user.clear(input);
    await user.type(input, '새');
    
    expect(mockOnTitleChange).toHaveBeenCalledWith('테스트 루틴새');
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
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const input = screen.getByLabelText('루틴 제목');
    await user.type(input, '{Enter}');
    
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('ESC 키를 누르면 취소가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const input = screen.getByLabelText('루틴 제목');
    await user.type(input, '{Escape}');
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('저장 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const saveButton = screen.getByText('저장');
    await user.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('취소 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const cancelButton = screen.getByText('취소');
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('폼이 유효하지 않을 때 Enter 키로 저장이 호출되지 않는다', async () => {
    const user = userEvent.setup();
    const invalidForm: RoutineTitleForm = {
      title: '',
      isValid: false,
      error: '제목을 입력해주세요'
    };
    
    render(
      <RoutineTitleView
        form={invalidForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const input = screen.getByLabelText('루틴 제목');
    await user.type(input, '{Enter}');
    
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('문자 수가 표시된다', () => {
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('6/50')).toBeInTheDocument();
  });

  it('모달 외부 클릭 시 취소가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('접근성 속성이 올바르게 설정된다', () => {
    render(
      <RoutineTitleView
        form={mockForm}
        onTitleChange={mockOnTitleChange}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'routine-title-modal-title');
    
    const input = screen.getByLabelText('루틴 제목');
    expect(input).toHaveAttribute('maxlength', '50');
  });
}); 