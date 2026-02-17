import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CreateRoutine } from './CreateRoutine';
import * as bodyPartApi from './bodyPartApi';

const mockNavigate = jest.fn();
const fetchBodyPartsSpy = jest.spyOn(bodyPartApi, 'fetchBodyParts');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const MOCK_BODY_PARTS = [
  { id: 'chest', name: '가슴' },
  { id: 'back', name: '등' },
  { id: 'legs', name: '하체' },
  { id: 'shoulders', name: '어깨' },
  { id: 'arms', name: '팔' },
  { id: 'abs', name: '코어(복부)' },
  { id: 'calves', name: '종아리' },
  { id: 'fullbody', name: '전신' },
  { id: 'cardio', name: '유산소' }
];

const renderWithRouter = (initialEntry?: string | { pathname: string; state?: unknown }) => {
  render(
    <MemoryRouter initialEntries={initialEntry ? [initialEntry] : ['/create-routine']}>
      <CreateRoutine />
    </MemoryRouter>
  );
};

describe('CreateRoutine', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    fetchBodyPartsSpy.mockReset();
    fetchBodyPartsSpy.mockResolvedValue(MOCK_BODY_PARTS);
  });

  it('CreateRoutine 컴포넌트가 API 조회 결과로 렌더링된다', async () => {
    renderWithRouter();

    expect(screen.getByText('운동 루틴 만들기')).toBeInTheDocument();
    expect(screen.getByText('운동할 부위를 선택해주세요')).toBeInTheDocument();
    expect(fetchBodyPartsSpy).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('가슴')).toBeInTheDocument();
    expect(screen.getByText('코어(복부)')).toBeInTheDocument();
  });

  it('부위 선택 시 운동 선택 화면으로 라우팅된다', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const chestButton = await screen.findByText('가슴');
    await user.click(chestButton);

    expect(mockNavigate).toHaveBeenCalledWith('/exercise-selection/chest');
  });

  it('조회 실패 시 에러를 보여주고 재시도로 다시 조회한다', async () => {
    const user = userEvent.setup();
    fetchBodyPartsSpy
      .mockRejectedValueOnce(new Error('request failed'))
      .mockResolvedValueOnce(MOCK_BODY_PARTS);

    renderWithRouter();

    expect(
      await screen.findByText('운동 부위 목록을 불러오지 못했습니다.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    await waitFor(() => {
      expect(fetchBodyPartsSpy).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByText('가슴')).toBeInTheDocument();
  });

  it('edit 모드 진입 시 편집 화면으로 리다이렉트하고 조회를 건너뛴다', async () => {
    renderWithRouter({
      pathname: '/create-routine',
      state: { mode: 'edit', presetId: '2' }
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/exercise-selection/edit', {
        replace: true,
        state: { mode: 'edit', presetId: '2' }
      });
    });
    expect(fetchBodyPartsSpy).not.toHaveBeenCalled();
  });
});
